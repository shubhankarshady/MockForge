"use server";

import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { generateInterviewQuestions, evaluateAnswer } from "@/lib/ai/service";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

import { eq, desc } from "drizzle-orm";
import { UserAnswer, AptitudeTest, AptitudeAnswer } from "@/lib/db/schema/index";

export async function createMockInterview(formData) {
  const jobPosition = formData.get("jobPosition");
  const jobDesc = formData.get("jobDesc");
  const jobExperience = formData.get("jobExperience");
  const createdBy = formData.get("createdBy");

  try {
    const aiResponse = await generateInterviewQuestions(jobPosition, jobDesc, jobExperience);
    const mockId = uuidv4();

    await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: JSON.stringify(aiResponse),
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperience: jobExperience,
      createdBy: createdBy,
    });

    revalidatePath("/dashboard");
    return { success: true, mockId };
  } catch (error) {
    console.error("Error creating mock interview:", error);
    return { success: false, error: error.message };
  }
}

export async function submitInterview(mockId) {
  try {
    // 1. Get all answers for this interview
    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, mockId))
      .orderBy(UserAnswer.id);

    if (!answers || answers.length === 0) {
      return { success: false, error: "No answers found to evaluate." };
    }

    // 2. Promise.all loop for evaluations
    const evaluations = await Promise.all(
      answers.map(async (ans) => {
        const aiResponse = await evaluateAnswer(ans.questions, ans.userAns);
        return {
          rating: aiResponse.rating,
          question: aiResponse.question || ans.questions,
          userans: aiResponse.userans || ans.userAns,
          correctans: aiResponse.correctans || ans.correctAns,
          feedback: aiResponse.feedback,
          sentiment: aiResponse.sentiment,
          technical_keywords: aiResponse.technical_keywords,
        };
      })
    );

    // 3. Bundle into finalAIFeedback
    const totalRating = evaluations.reduce((sum, item) => sum + Number(item.rating), 0);
    const avgRating = totalRating / evaluations.length;

    const finalAIFeedback = {
      overall_score: Math.round(avgRating * 10),
      summary: "Consolidated AI feedback based on your performance in this interview session.",
      strengths: evaluations.filter(e => e.rating >= 8).map(e => e.question).slice(0, 3),
      weaknesses: evaluations.filter(e => e.rating < 6).map(e => e.question).slice(0, 3),
      qa_breakdown: evaluations,
    };

    // 4. Update the MockInterview record with bundled feedback
    await db
      .update(MockInterview)
      .set({ aifeedback: JSON.stringify(finalAIFeedback) })
      .where(eq(MockInterview.mockId, mockId));

    revalidatePath(`/dashboard/interview/${mockId}/feedback`);
    return { success: true };
  } catch (error) {
    console.error("Error in submitInterview:", error);
    return { success: false, error: error.message };
  }
}

export async function getInterviewList(email) {
  try {
    if (!email) return [];
    
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, email))
      .orderBy(desc(MockInterview.id));
    
    return result;
  } catch (error) {
    console.error("Error in getInterviewList:", error);
    return [];
  }
}

export async function deleteMockInterview(mockId) {
  console.log("Attempting to delete interview with mockId:", mockId);
  try {
    if (!mockId) throw new Error("mockId is required");

    // 1. Delete associated user answers
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
    
    // 2. Delete associated aptitude answers (testidref matches mockId)
    await db.delete(AptitudeAnswer).where(eq(AptitudeAnswer.testIdRef, mockId));

    // 3. Delete associated aptitude tests
    await db.delete(AptitudeTest).where(eq(AptitudeTest.mockId, mockId));
    
    // 4. Delete the main interview record
    const result = await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));
    console.log("Delete interview result:", result);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMockInterview:", error);
    return { success: false, error: error.message };
  }
}
