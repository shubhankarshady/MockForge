export const INTERVIEW_PROMPT = `
You are an API that generates interview questions.

Return ONLY valid JSON.
No markdown.
No explanations.
No extra text.

Generate exactly 5 interview questions with answers for:

Job Position: {jobPosition}
Job Description: {jobDesc}
Experience: {jobExperience} years

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

export const EVALUATION_PROMPT = `
You are an interview evaluator.

Evaluate the user's answer to the following question.
Ignore spelling mistakes.
Question:
{question}

User Answer:
{userAnswer}

Give:
1. Rating from 1 to 10
2. Short constructive feedback (max 3 lines)

Return ONLY valid JSON:

{
  "rating": number,
  "feedback": string
}
`;

export const APTITUDE_EVALUATION_PROMPT = `
You are an expert aptitude test evaluator.

Evaluate the user's performance in the {category} category.
User Score: {score} out of {totalQuestions}

The user struggled with questions related to:
{incorrectSummary}

Provide a short, encouraging, and constructive feedback  (max 8 lines) suggesting areas for improvement.

Return ONLY valid JSON:

{
  "feedback": string
}
`;
