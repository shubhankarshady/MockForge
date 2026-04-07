"use server";

import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { generateInterviewQuestions } from "@/lib/ai/service";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

import { eq, desc } from "drizzle-orm";
import { UserAnswer } from "@/lib/db/schema/index";

export async function createMockInterview(formData) {
  const jobPosition = formData.get("jobPosition");
  const jobDesc = formData.get("jobDesc");
  const jobExperiance = formData.get("jobExperience");
  const createdBy = formData.get("createdBy");

  try {
    const aiResponse = await generateInterviewQuestions(jobPosition, jobDesc, jobExperiance);
    const mockId = uuidv4();

    await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: JSON.stringify(aiResponse),
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperiance: jobExperiance,
      createdBy: createdBy,
    });

    revalidatePath("/dashboard");
    return { success: true, mockId };
  } catch (error) {
    console.error("Error creating mock interview:", error);
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
  try {
    // Delete associated user answers
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
    
    // Delete the interview record
    await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMockInterview:", error);
    return { success: false, error: error.message };
  }
}
