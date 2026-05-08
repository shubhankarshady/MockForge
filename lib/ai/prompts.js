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
You are a technical interview evaluator. 
Analyze the user's answer for the specific question provided.

Question: {question}
User Answer: {userAnswer}

Return a STRICT JSON object with these exact keys:
{
  "rating": number,
  "question": "The original question text",
  "userans": "The provided user answer",
  "correctans": "The ideal technical answer for this question",
  "feedback": "3 lines of constructive feedback",
  "sentiment": "Confident, Hesitant, or Neutral",
  "technical_keywords": ["keyword1", "keyword2"]
}

Return ONLY valid JSON. No markdown. No extra text.
`;

export const TRANSCRIPT_SPLIT_PROMPT = `
You are a technical interview analyst. 
You are given a full transcript of a voice interview conversation between an AI Interviewer and a Candidate.
You are also given the list of original interview questions.

Original Questions:
{questions}

Conversation Transcript:
{transcript}

Your task is to extract the Candidate's specific answer for EACH question from the transcript.
If a question was skipped or not answered, provide "No answer provided".

Return a JSON object with a "mappedAnswers" array. Each item should have:
- "question": The original question text
- "userAns": The candidate's extracted answer
- "correctans": The provided ideal answer for this question (if available in original questions)

JSON format:
{
  "mappedAnswers": [
    {
      "question": "...",
      "userAns": "...",
      "correctans": "..."
    }
  ]
}

Return ONLY valid JSON. No markdown. No extra text.
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
