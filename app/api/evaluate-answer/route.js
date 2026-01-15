import { GoogleGenAI } from "@google/genai";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const {
      mockId,
      question,
      correctAns,
      userAnswer,
      userEmail,
    } = await req.json();

    // ---------- Gemini evaluation ----------
    const prompt = `
You are an interview evaluator.

Evaluate the user's answer to the following question.
Ignore spelling mistakes.
Question:
${question}

User Answer:
${userAnswer}

Give:
1. Rating from 1 to 10
2. Short constructive feedback (max 3 lines)

Return ONLY valid JSON:

{
  "rating": number,
  "feedback": string
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = response.text;
    console.log("GEMINI RAW OUTPUT >>>", raw);

    const parsed = JSON.parse(raw);

    const { rating, feedback } = parsed;

    // ---------- Store in DB ----------
    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      questions: question,
      correctAns: correctAns,
      userAns: userAnswer,
      feedback: feedback,
      rating: String(rating),
      userEmail: userEmail,
    });

    return Response.json({
      success: true,
      rating,
      feedback,
    });

  } catch (err) {
  console.error("FULL SERVER ERROR >>>", err);

  return Response.json(
    {
      error: err.message,
      stack: err.stack,
      type: err.name,
    },
    { status: 500 }
  );
}

}
