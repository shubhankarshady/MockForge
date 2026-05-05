"use client";

import { Volume1, Volume2, HelpCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function QuestionsSection({
  questions,
  activeIndex,
  setActiveIndex,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Normalize questions to ensure we always have an array of strings/objects
  const normalizedQuestions = useMemo(() => {
    if (!questions) return [];
    
    let q = questions;

    // 1. If it's a string, try to parse it
    if (typeof q === 'string') {
      try {
        q = JSON.parse(q);
      } catch (e) {
        return [q]; // Return as single question if parsing fails
      }
    }

    // 2. If it's an array with one element that looks like a JSON array, parse that element
    if (Array.isArray(q) && q.length === 1 && typeof q[0] === 'string' && q[0].trim().startsWith('[')) {
      try {
        const nested = JSON.parse(q[0]);
        if (Array.isArray(nested)) q = nested;
      } catch (e) {}
    }

    // 3. If it's an object with a questions key, extract it
    if (q && typeof q === 'object' && !Array.isArray(q)) {
      q = q.questions || q.Questions || q.interview_questions || [q];
    }

    let finalArray = Array.isArray(q) ? q : [q];

    // 4. Ensure inner elements are also parsed if they are JSON strings
    return finalArray.map(item => {
      if (typeof item === 'string') {
        try {
           const parsed = JSON.parse(item);
           return parsed !== null ? parsed : item;
        } catch(e) {
           return item;
        }
      }
      return item;
    });
  }, [questions]);

  const activeQuestion = normalizedQuestions[activeIndex];
  
  // Extract question text safely regardless of data shape
  const questionText = useMemo(() => {
    if (!activeQuestion) return "";
    
    let text = activeQuestion;

    if (typeof text === 'string') {
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          text = parsed;
        }
      } catch(e) {}
    }

    if (typeof text === 'object' && text !== null) {
      let current = text;
      
      // Unwrap double-nested structures
      while (current && typeof current === 'object') {
         if (current.question) {
            current = current.question;
         } else if (current.Question) {
            current = current.Question;
         } else if (current.interview_questions) {
            current = current.interview_questions;
         } else {
            break;
         }

         // Try to parse if it became a JSON string
         if (typeof current === 'string') {
            try {
               const parsed = JSON.parse(current);
               if (typeof parsed === 'object' && parsed !== null) {
                  current = parsed;
               }
            } catch(e) {}
         }
      }
      
      if (typeof current === 'string') {
         return current;
      }
      
      return JSON.stringify(text);
    }

    return String(text);
  }, [activeQuestion]);

  const readQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  if (normalizedQuestions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
        <HelpCircle size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">No Questions Found</h2>
        <p className="text-slate-500 mt-2 text-center max-w-xs">
          We couldn't load the interview questions. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col relative overflow-hidden h-full">
      <div className="relative z-10 mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Interview Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Review the questions and answer thoughtfully.</p>
        </div>
      </div>

      {/* Pagination Pills */}
      <div className="flex gap-2.5 mb-8 flex-wrap relative z-10">
        {normalizedQuestions.map((_, index) => (
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
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-inner flex-1 transition-all duration-300">
        
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center justify-center rounded-lg bg-blue-100/80 px-2.5 py-1 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-200">
             Question {activeIndex + 1}
          </div>
          
          <button
            onClick={() => readQuestion(questionText)}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 shadow-sm border ${
              isSpeaking 
                 ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/30 scale-105 animate-pulse" 
                 : "bg-white border-blue-100 text-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
            }`}
            title={isSpeaking ? "Speaking..." : "Read question"}
          >
            {isSpeaking ? <Volume2 size={20} /> : <Volume1 size={20} />}
          </button>
        </div>

        <p className="font-medium text-[19px] text-slate-800 leading-relaxed mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {questionText}
        </p>

        {/* Helpful Tip */}
        <div className="mt-auto pt-6">
           <div className="bg-white/60 rounded-xl p-4 border border-blue-100/50 text-[13px] text-blue-600/80 leading-snug">
              <strong>Tip:</strong> Try to include specific examples from your past projects to make your answer more impactful.
           </div>
        </div>
      </div>
    </div>
  );
}
