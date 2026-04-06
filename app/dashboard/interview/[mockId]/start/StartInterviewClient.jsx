"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionsSection from "./components/QuestionSection";
import RecordAnsSection from "./components/RecordAnsSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
      {/* LEFT - QUESTIONS */}
      <QuestionsSection
        questions={mockInterviewQuestions}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      {/* RIGHT - RECORDING & NAV */}
      <div className="border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md rounded-xl p-6 shadow-2xl flex flex-col">
        <h1 className="text-xl font-bold mb-2 text-white">Interview Started</h1>
        <p className="mb-6 text-neutral-300">
          <strong className="text-white font-medium">Position:</strong> {interviewData?.jobPosition}
        </p>

        <div className="flex-1">
          <RecordAnsSection
            mockId={interviewData?.mockId}
            activeQuestion={activeQuestion}
            user={user}
          />
        </div>

        {/* Dynamic Navigation Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
          {activeIndex > 0 && (
            <Button
              onClick={() => setActiveIndex(activeIndex - 1)}
              variant="outline"
              className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          {activeIndex < mockInterviewQuestions.length - 1 && (
            <Button
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="bg-[#ececec] text-[#050505] hover:bg-white"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {isLastQuestion && (
            <Button
              onClick={handleFinishInterview}
              className="bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]"
            >
              Finish Interview
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
