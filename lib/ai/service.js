import { GoogleGenerativeAI } from "@google/generative-ai";
import { INTERVIEW_PROMPT, EVALUATION_PROMPT, APTITUDE_EVALUATION_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateInterviewQuestions(jobPosition, jobDesc, jobExperience) {
  const prompt = INTERVIEW_PROMPT
    .replace("{jobPosition}", jobPosition)
    .replace("{jobDesc}", jobDesc)
    .replace("{jobExperience}", jobExperience);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Basic cleaning of potential markdown
  const cleanJson = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(cleanJson);
}

// ... rest of your functions (evaluateAnswer, evaluateAptitudeTest) remain the same

export async function evaluateAnswer(question, userAnswer) {
  const prompt = EVALUATION_PROMPT
    .replace("{question}", question)
    .replace("{userAnswer}", userAnswer);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleanJson = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleanJson);
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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const cleanJson = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(cleanJson);
}
