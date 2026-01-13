"use client";

import { useEffect, useState } from "react";
import QuestionsSection from "./components/QuestionSection";


export default function StartInterviewClient({ interview }) {

  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    startInterviewData(interview);
  }, [interview]);

  const startInterviewData = (data) => {
    console.log("Interview loaded:", data);

    try {
      const jsonMockResp = JSON.parse(data.jsonMockResp);
      setMockInterviewQuestions(jsonMockResp.questions || []);
      setInterviewData(data);
    } catch (err) {
      console.error("Failed to parse interview JSON:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {/* LEFT: Questions */}
      <QuestionsSection questions={mockInterviewQuestions} />

      {/* RIGHT: Recording / Info */}
      <div className="border rounded-lg p-5">
        <h1 className="text-xl font-bold mb-2">Interview Started</h1>
        <p className="mb-4">
          <strong>Position:</strong> {interviewData?.jobPosition}
        </p>

        {/* Audio / Video recording UI goes here later */}
        <div className="text-sm text-muted-foreground">
          Recording section coming next…
        </div>
      </div>

    </div>
  );
}
