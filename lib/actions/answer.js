"use server";

import { db } from "@/lib/db/index";
import { UserAnswer } from "@/lib/db/schema/index";
import { evaluateAnswer, splitVapiTranscript } from "@/lib/ai/service";
import { revalidatePath } from "next/cache";

export async function saveUserAnswer(data) {
  const { mockId, question, correctAns, userAns, userEmail } = data;

  try {
    const evaluation = await evaluateAnswer(question, userAns);

    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      questions: JSON.stringify({ question }),
      correctness: JSON.stringify({ answer: correctAns }),
      userAns: JSON.stringify({ userAns }),
      feedback: JSON.stringify({ feedback: evaluation.feedback, rating: evaluation.rating }),
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

export async function processVapiTranscript(data) {
  const { mockId, questions, transcript, userEmail } = data;

  try {
    const splitData = await splitVapiTranscript(questions, transcript);
    const results = [];

    for (const item of splitData.mappedAnswers) {
      const result = await saveUserAnswer({
        mockId,
        question: item.question,
        correctAns: item.correctans || "No answer available",
        userAns: item.userAns,
        userEmail: userEmail,
      });
      results.push(result);
    }

    return { success: true, count: results.length };
  } catch (error) {
    console.error("Error processing Vapi transcript:", error);
    return { success: false, error: error.message };
  }
}
