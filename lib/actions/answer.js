"use server";

import { db } from "@/lib/db/index";
import { UserAnswer } from "@/lib/db/schema/index";
import { evaluateAnswer } from "@/lib/ai/service";
import { revalidatePath } from "next/cache";

export async function saveUserAnswer(data) {
  const { mockId, question, correctAns, userAns, userEmail } = data;

  try {
    const evaluation = await evaluateAnswer(question, userAns);

    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      questions: question,
      correctAns: correctAns,
      userAns: userAns,
      feedback: evaluation.feedback,
      rating: String(evaluation.rating),
      userEmail: userEmail,
    });

    revalidatePath(`/dashboard/interview/${mockId}/feedback`);
    return { success: true, evaluation };
  } catch (error) {
    console.error("Error saving user answer:", error);
    return { success: false, error: error.message };
  }
}
