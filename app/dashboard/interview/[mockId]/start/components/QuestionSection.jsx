"use client";

import { Volume1, Volume2, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

export default function QuestionsSection({
  questions,
  activeIndex,
  setActiveIndex,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVapiActive, setIsVapiActive] = useState(false);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Vapi call started");
      setIsVapiActive(true);
      setIsSpeaking(true);
    });

    vapi.on("call-end", () => {
      console.log("Vapi call ended");
      setIsVapiActive(false);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    return () => {
      vapi.stop();
    };
  }, []);

  // Automatically read question when activeIndex changes and Vapi is active
  useEffect(() => {
    if (isVapiActive && questions && questions[activeIndex]) {
      const text = questions[activeIndex].question;
      vapi.send({
        type: "add-message",
        message: {
          role: "assistant",
          content: text,
        },
      });
    }
  }, [activeIndex, isVapiActive, questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col relative overflow-hidden">
        <h2 className="text-xl font-bold mb-2 text-slate-800">Interview Questions</h2>
        <p className="text-slate-500 mt-4 text-center p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">No questions found.</p>
      </div>
    );
  }

  const activeQuestion = questions[activeIndex];

  const toggleVapi = async () => {
    if (isVapiActive) {
      vapi.stop();
    } else {
      try {
        await vapi.start(assistantId);
        // Once started, the useEffect will trigger sending the first question
      } catch (err) {
        console.error("Vapi start failed:", err);
      }
    }
  };

  const readQuestionWithVapi = (text) => {
    if (!isVapiActive) {
      toggleVapi();
      return;
    }

    vapi.send({
      type: "add-message",
      message: {
        role: "assistant",
        content: text,
      },
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col relative overflow-hidden h-full">
      <div className="relative z-10 mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Interview Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Review the questions and answer thoughtfully.</p>
        </div>
        
        <button
          onClick={toggleVapi}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            isVapiActive 
              ? "bg-red-50 text-red-600 border border-red-100" 
              : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          }`}
        >
          {isVapiActive ? (
            <>
              <MicOff size={16} /> Stop Vapi
            </>
          ) : (
            <>
              <Mic size={16} /> Start Vapi
            </>
          )}
        </button>
      </div>

      {/* Pagination Pills */}
      <div className="flex gap-2.5 mb-8 flex-wrap relative z-10">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center justify-center min-w-[44px] h-10 px-4 rounded-xl border text-sm font-semibold transition-all ${
              activeIndex === index
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            }`}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-inner flex-1">
        
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center justify-center rounded-lg bg-blue-100/80 px-2.5 py-1 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-200">
             Question {activeIndex + 1}
          </div>
          
          <button
            onClick={() => readQuestionWithVapi(activeQuestion.question)}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 shadow-sm border ${
              isSpeaking 
                 ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/30 scale-105 animate-pulse" 
                 : "bg-white border-blue-100 text-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
            }`}
            title={isSpeaking ? "Speaking..." : "Read question with Vapi"}
          >
            {isSpeaking ? <Volume2 size={20} /> : <Volume1 size={20} />}
          </button>
        </div>

        <p className="font-medium text-[19px] text-slate-800 leading-relaxed mt-2">
          {activeQuestion.question}
        </p>

      </div>
    </div>
  );
}

