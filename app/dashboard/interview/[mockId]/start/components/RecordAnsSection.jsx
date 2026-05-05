"use client";

import dynamic from "next/dynamic";
import { LoaderCircle, MessageSquare, Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SpeechRecorder = dynamic(() => import("./SpeechRecorder"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[350px] w-full rounded-2xl bg-slate-50/50 border border-slate-100 shadow-inner p-8">
      <LoaderCircle className="animate-spin text-blue-500" size={32} />
      <span className="text-sm font-medium text-slate-500">Loading recording engine...</span>
    </div>
  ),
});

const VapiInterview = dynamic(() => import("./VapiInterview"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[350px] w-full rounded-2xl bg-slate-50/50 border border-slate-100 shadow-inner p-8">
      <LoaderCircle className="animate-spin text-indigo-500" size={32} />
      <span className="text-sm font-medium text-slate-500">Connecting to Vapi AI...</span>
    </div>
  ),
});

export default function RecordAnsSection({ mockId, activeQuestion, questions, jobPosition, user, onStateChange }) {
  const [mode, setMode] = useState("vapi"); // "vapi" or "recorder"

  return (
    <div className="flex flex-col h-full">
      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 self-center shadow-sm ring-1 ring-slate-200">
        <button
          onClick={() => setMode("vapi")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "vapi" 
            ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-100/50 scale-[1.02]" 
            : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Sparkles size={16} className={mode === "vapi" ? "text-blue-500" : ""} />
          AI Voice
        </button>
        <button
          onClick={() => setMode("recorder")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "recorder" 
            ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-100/50 scale-[1.02]" 
            : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <MessageSquare size={16} className={mode === "recorder" ? "text-blue-500" : ""} />
          Speech-to-Text
        </button>
      </div>

      <div className="flex-1">
        {mode === "vapi" ? (
          <VapiInterview 
            mockId={mockId} 
            questions={questions} 
            jobPosition={jobPosition}
            user={user} 
            onStateChange={onStateChange}
          />
        ) : (
          <SpeechRecorder
            mockId={mockId}
            activeQuestion={activeQuestion}
            user={user}
            onStateChange={onStateChange}
          />
        )}
      </div>

      <div className="mt-6 text-center">
         <p className="text-[12px] text-slate-400">
           {mode === "vapi" 
             ? "Switch to 'Speech-to-Text' if you prefer to answer questions one by one manually." 
             : "Switch to 'AI Voice' for a continuous, real-time conversational experience."}
         </p>
      </div>
    </div>
  );
}
