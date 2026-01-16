"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionsSection from "./components/QuestionSection";
import RecordAnsSection from "./components/RecordAnsSection";
import { Button } from "@/components/ui/button";

export default function StartInterviewClient({ interview, user }) {
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();

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

  const activeQuestion = mockInterviewQuestions[activeIndex];
  const isLastQuestion = activeIndex === mockInterviewQuestions.length - 1;

  const handleFinishInterview = () => {
    router.push(`/dashboard/interview/${interviewData.mockId}/feedback`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* LEFT */}
      <QuestionsSection
        questions={mockInterviewQuestions}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      {/* RIGHT */}
      <div className="border rounded-lg p-5 flex flex-col">
        <h1 className="text-xl font-bold mb-2">Interview Started</h1>
        <p className="mb-4">
          <strong>Position:</strong> {interviewData?.jobPosition}
        </p>

        <RecordAnsSection
          mockId={interviewData?.mockId}
          activeQuestion={activeQuestion}
          user={user}
        />

        {/* Finish button */}
        {isLastQuestion && (
          <Button
            onClick={handleFinishInterview}
            className="mt-6 w-full"
            variant="default"
          >
            Finish Interview
          </Button>
        )}
      </div>
    </div>
  );
}
