import Groq from "groq-sdk";
import { INTERVIEW_PROMPT, EVALUATION_PROMPT, APTITUDE_EVALUATION_PROMPT, TRANSCRIPT_SPLIT_PROMPT } from "./prompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

async function getGroqResponse(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: MODEL,
    response_format: { type: "json_object" },
  });

  const text = chatCompletion.choices[0]?.message?.content || "";
  
  // Groq's json_object format usually returns clean JSON, 
  // but we keep the cleaning logic just in case or if format is not supported by all models
  const cleanJson = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(cleanJson);
}

export async function generateInterviewQuestions(jobPosition, jobDesc, jobExperience) {
  const prompt = INTERVIEW_PROMPT
    .replace("{jobPosition}", jobPosition)
    .replace("{jobDesc}", jobDesc)
    .replace("{jobExperience}", jobExperience);

  return await getGroqResponse(prompt);
}

export async function splitVapiTranscript(questions, transcript) {
  const prompt = TRANSCRIPT_SPLIT_PROMPT
    .replace("{questions}", JSON.stringify(questions))
    .replace("{transcript}", transcript);

  return await getGroqResponse(prompt);
}

export async function evaluateAnswer(question, userAnswer) {
  const prompt = EVALUATION_PROMPT
    .replace("{question}", question)
    .replace("{userAnswer}", userAnswer);

  return await getGroqResponse(prompt);
}

export async function evaluateAptitudeTest(category, score, totalQuestions, incorrectOnes) {
  const incorrectSummary = incorrectOnes.length > 0 
    ? incorrectOnes.join(", ") 
    : "None, user performed perfectly!";

  const prompt = APTITUDE_EVALUATION_PROMPT
    .replace("{category}", category)
    .replace("{score}", score)
    .replace("{totalQuestions}", totalQuestions)
    .replace("{incorrectSummary}", incorrectSummary);

  return await getGroqResponse(prompt);
}
