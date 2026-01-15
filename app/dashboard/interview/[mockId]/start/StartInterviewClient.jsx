"use client";

import { useEffect, useState } from "react";
import QuestionsSection from "./components/QuestionSection";
import RecordAnsSection from "./components/RecordAnsSection";

export default function StartInterviewClient({ interview, user }) {
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // ✅ track active question

  useEffect(() => {
    startInterviewData(interview);
  }, [interview]);

  const startInterviewData = (data) => {
    try {
      const jsonMockResp = JSON.parse(data.jsonMockResp);
      setMockInterviewQuestions(jsonMockResp.questions || []);
      setInterviewData(data);
    } catch (err) {
      console.error("Failed to parse interview JSON:", err);
    }
  };

  const activeQuestion = mockInterviewQuestions[activeIndex]; // ✅ current question

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* LEFT */}
      <QuestionsSection
        questions={mockInterviewQuestions}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      {/* RIGHT */}
      <div className="border rounded-lg p-5">
        <h1 className="text-xl font-bold mb-2">Interview Started</h1>
        <p className="mb-4">
          <strong>Position:</strong> {interviewData?.jobPosition}
        </p>

        <RecordAnsSection
          mockId={interviewData?.mockId}
          activeQuestion={activeQuestion}
          user={user}
        />
      </div>
    </div>
  );
}
