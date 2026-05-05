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
  const [isBusy, setIsBusy] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (interview) {
      startInterviewData(interview);
    }
  }, [interview]);

  const startInterviewData = (data) => {
    try {
      // 1. Get the raw JSON string (handle case sensitivity from different DB drivers)
      let rawJson = data.jsonMockResp || data.jsonmockresp;
      
      if (!rawJson) {
        console.error("No jsonMockResp found in interview data:", data);
        return;
      }

      // 2. Parse the JSON (handle potential double-encoding)
      let parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      
      // If result is still a string, parse again (double-encoded)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      // 3. Extract the questions array
      let questionsArray = [];
      
      if (Array.isArray(parsed)) {
        // Direct array of questions/strings
        questionsArray = parsed;
      } else if (parsed && typeof parsed === 'object') {
        // Object containing questions (handle case sensitivity)
        questionsArray = parsed.questions || parsed.Questions || parsed.interview_questions || [];
        
        // If still empty but the object looks like the whole row, 
        // try to see if it's nested
        if (questionsArray.length === 0 && (parsed.jsonmockresp || parsed.jsonMockResp)) {
           const nestedRaw = parsed.jsonmockresp || parsed.jsonMockResp;
           const nestedParsed = typeof nestedRaw === 'string' ? JSON.parse(nestedRaw) : nestedRaw;
           questionsArray = Array.isArray(nestedParsed) ? nestedParsed : (nestedParsed.questions || nestedParsed.interview_questions || []);
        }
      }

      // 4. Deeply Normalize and clean the questions array
      const cleanQuestions = questionsArray.map(item => {
         let current = item;
         
         // Parse inner strings if any
         if (typeof current === 'string') {
            try { 
               const parsedItem = JSON.parse(current);
               if (parsedItem !== null) current = parsedItem; 
            } catch(e) {}
         }
         
         // Unwrap nested properties if it's an object
         if (typeof current === 'object' && current !== null) {
            let extractedQuestion = current.question || current.Question || current.interview_questions;
            let extractedAnswer = current.answer || current.Answer || "";

            while (extractedQuestion && (typeof extractedQuestion === 'object' || typeof extractedQuestion === 'string')) {
               if (typeof extractedQuestion === 'string') {
                  try {
                     const parsedQ = JSON.parse(extractedQuestion);
                     if (parsedQ && typeof parsedQ === 'object') {
                        extractedQuestion = parsedQ;
                     } else {
                        break;
                     }
                  } catch(e) {
                     break;
                  }
               }
               
               if (typeof extractedQuestion === 'object' && extractedQuestion !== null) {
                  if (extractedQuestion.question) extractedQuestion = extractedQuestion.question;
                  else if (extractedQuestion.Question) extractedQuestion = extractedQuestion.Question;
                  else if (extractedQuestion.interview_questions) extractedQuestion = extractedQuestion.interview_questions;
                  else break;
               }
            }

            if (typeof extractedQuestion === 'object' && extractedQuestion !== null) {
               extractedQuestion = JSON.stringify(extractedQuestion);
            }

            return {
               ...current,
               question: typeof extractedQuestion === 'string' ? extractedQuestion : String(extractedQuestion || ""),
               answer: extractedAnswer
            };
         }
         
         // Fallback for primitives
         return { question: String(current), answer: "" };
      });

      console.log("StartInterviewClient: Successfully extracted and cleaned questions:", cleanQuestions);
      setMockInterviewQuestions(cleanQuestions);
      setInterviewData(data);
    } catch (err) {
      console.error("Failed to parse interview JSON:", err);
      // Fallback: if parsing fails but data is already an object/array
      setMockInterviewQuestions([]);
    }
  };

  const activeQuestion = mockInterviewQuestions[activeIndex];
  const isLastQuestion = activeIndex === mockInterviewQuestions.length - 1;

  const handleFinishInterview = () => {
    if (isBusy) {
      alert("Please end the current recording or AI voice call before finishing the interview.");
      return;
    }
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
      {/* LEFT - QUESTIONS */}
      <QuestionsSection
        questions={mockInterviewQuestions}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      {/* RIGHT - RECORDING & NAV */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 mb-6 border-b border-slate-100 pb-4">
           <div className="flex items-center gap-3 mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm"></span>
              </span>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Active Interview</h1>
           </div>
           <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-slate-700">Role:</span> {interviewData?.jobPosition}
           </p>
        </div>

        <div className="flex-1 relative z-10 min-h-[400px]">
          <RecordAnsSection
            mockId={interviewData?.mockId}
            activeQuestion={activeQuestion}
            questions={mockInterviewQuestions}
            jobPosition={interviewData?.jobPosition}
            user={user}
            onStateChange={setIsBusy}
          />
        </div>

        {/* Dynamic Navigation Buttons */}
        <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          
          <div className="flex-shrink-0">
            {activeIndex > 0 && (
              <Button
                onClick={() => setActiveIndex(activeIndex - 1)}
                variant="outline"
                className="border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {activeIndex < mockInterviewQuestions.length - 1 && (
              <Button
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-6 transition-all"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {isLastQuestion && (
              <Button
                onClick={handleFinishInterview}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 rounded-xl px-6 transition-all group"
              >
                Finish Interview
                <CheckCircle className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
