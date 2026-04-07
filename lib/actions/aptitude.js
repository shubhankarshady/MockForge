"use server";

import { db } from "@/lib/db/index";
import { AptitudeTest, AptitudeAnswer } from "@/lib/db/schema/index";
import { evaluateAptitudeTest } from "@/lib/ai/service";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

/**
 * Fetches at least 30 unique questions from the external aptitude API.
 * Since the API returns one random question per call, we perform multiple parallel requests.
 * @param {string} category - The category of the test
 */
export async function fetchAptitudeQuestions(category) {
  try {
    const fetchPromises = Array.from({ length: 40 }).map(() => 
      fetch(`https://aptitude-gold.vercel.app/${category}`, { cache: "no-store" })
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
    );

    const results = await Promise.all(fetchPromises);
    
    // Deduplicate questions based on the question text
    const uniqueQuestionsMap = new Map();
    results.forEach(q => {
      if (q && q.question) {
        uniqueQuestionsMap.set(q.question, q);
      }
    });

    // Return first 30 unique questions
    return Array.from(uniqueQuestionsMap.values()).slice(0, 30);
  } catch (error) {
    console.error("Error in fetchAptitudeQuestions:", error);
    return [];
  }
}

export async function getTestHistory(email) {
  try {
    if (!email) return [];
    
    const result = await db
      .select()
      .from(AptitudeTest)
      .where(eq(AptitudeTest.createdBy, email))
      .orderBy(desc(AptitudeTest.createdAt)); // Most recent tests first
    
    return result;
  } catch (error) {
    console.error("Error in getTestHistory:", error);
    return [];
  }
}

export async function deleteAptitudeTest(mockId) {
  try {
    // Delete associated answers first due to potential references (though not strictly enforced by FK in this schema, it's good practice)
    await db.delete(AptitudeAnswer).where(eq(AptitudeAnswer.testIdRef, mockId));
    
    // Delete the main test record
    await db.delete(AptitudeTest).where(eq(AptitudeTest.mockId, mockId));

    revalidatePath("/dashboard/aptitude");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAptitudeTest:", error);
    return { success: false, error: error.message };
  }
}

export async function getAptitudeFeedback(testId) {
  try {
    const testResult = await db
      .select()
      .from(AptitudeTest)
      .where(eq(AptitudeTest.mockId, testId));

    const answersResult = await db
      .select()
      .from(AptitudeAnswer)
      .where(eq(AptitudeAnswer.testIdRef, testId));

    return {
      testData: testResult[0],
      answers: answersResult
    };
  } catch (error) {
    console.error("Error in getAptitudeFeedback:", error);
    return { testData: null, answers: [] };
  }
}

/**
 * Submits the aptitude test, calculates score, generates AI feedback, and saves to DB.
 * @param {Object} testData - Contains mockId, category, userEmail, questions (array of {question, correct_answer, user_answer})
 */
export async function submitAptitudeTest({ mockId, category, userEmail, questions }) {
  try {
    // 1. Calculate Score
    let score = 0;
    const totalQuestions = questions.length;
    
    const processedAnswers = questions.map((q) => {
      const isCorrect = q.user_answer === q.correct_answer;
      if (isCorrect) score++;
      
      return {
        questionText: q.question,
        correctAnswer: q.correct_answer,
        userAnswer: q.user_answer || "No answer",
        isCorrect: isCorrect.toString(),
      };
    });

    // 2. Generate AI Feedback
    // We pass the score and some sample incorrect answers to Gemini for context
    const incorrectOnes = processedAnswers
      .filter(a => a.isCorrect === "false")
      .map(a => a.questionText)
      .slice(0, 3); // Limit to top 3 for prompt brevity

    const aiResult = await evaluateAptitudeTest(category, score, totalQuestions, incorrectOnes);
    
    // 3. Save to Database (AptitudeTest)
    const [insertedTest] = await db.insert(AptitudeTest).values({
      mockId: mockId,
      category: category,
      score: score,
      totalQuestions: totalQuestions,
      aiFeedback: aiResult.feedback,
      createdBy: userEmail,
    }).returning();

    // 4. Save individual answers (AptitudeAnswer)
    const answersToInsert = processedAnswers.map(ans => ({
      ...ans,
      testIdRef: mockId, // Using mockId as the reference for easier lookups
    }));

    await db.insert(AptitudeAnswer).values(answersToInsert);

    revalidatePath("/dashboard/aptitude");
    return { success: true, mockId: mockId };
  } catch (error) {
    console.error("Error in submitAptitudeTest:", error);
    return { success: false, error: error.message };
  }
}
