"use client";

import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function QuestionsSection({
  questions,
  activeIndex,
  setActiveIndex,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Hooks always run
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeIndex]);

  // THEN conditional rendering
  if (!questions || questions.length === 0) {
    return (
      <div className="border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md rounded-xl p-6">
        <h2 className="font-bold mb-2 text-white">Questions</h2>
        <p className="text-neutral-400">No questions found.</p>
      </div>
    );
  }

  const activeQuestion = questions[activeIndex];

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md rounded-xl p-6 shadow-2xl">
      <h2 className="font-bold mb-6 text-white text-xl">Interview Questions</h2>

      <div className="flex gap-2 mb-8 flex-wrap">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
              activeIndex === index
                ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      <div className="flex items-start justify-between gap-4 p-5 rounded-lg bg-black/40 border border-white/5">
        <p className="font-medium text-lg flex-1 text-[#ececec] leading-relaxed">
          <span className="text-blue-400 font-bold mr-2 tracking-wide">Q{activeIndex + 1}.</span> {activeQuestion.question}
        </p>

        <button
          onClick={() => speakQuestion(activeQuestion.question)}
          className={`p-3 rounded-full transition-all flex-shrink-0 ${
            isSpeaking ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
          }`}
          title={isSpeaking ? "Stop reading" : "Read question"}
        >
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
}
