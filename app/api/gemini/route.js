import { GoogleGenAI } from "@google/genai";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



export async function POST(req) {
    
  const { jobPosition, jobDesc, jobExperiance, createdBy } = await req.json();

  const prompt = `
You are an API that generates interview questions.

Return ONLY valid JSON.
No markdown.
No explanations.
No extra text.

Generate exactly 5 interview questions with answers for:

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Experience: ${jobExperiance} years

JSON format:

{
  "questions": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    },
  });
  const raw = response.text;
  const parsed = JSON.parse(raw);

  const inserted = await db.insert(MockInterview).values({
    mockId: uuidv4(),
    jsonMockResp: raw,
    jobPosition,
    jobDesc,
    jobExperiance,
    createdBy,
  }).returning({ mockId: MockInterview.mockId });

  return Response.json({
    mockId: inserted[0].mockId,
    questions: parsed.questions,
  });


  
}
