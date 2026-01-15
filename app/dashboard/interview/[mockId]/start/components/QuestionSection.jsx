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
      <div className="border rounded-lg p-5">
        <h2 className="font-bold mb-2">Questions</h2>
        <p className="text-muted-foreground">No questions found.</p>
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
    <div className="border rounded-lg p-5">
      <h2 className="font-bold mb-4">Interview Questions</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-3 py-1 rounded border text-sm font-medium transition ${
              activeIndex === index
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-gray-200"
            }`}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-lg flex-1">
          Q{activeIndex + 1}. {activeQuestion.question}
        </p>

        <button
          onClick={() => speakQuestion(activeQuestion.question)}
          className={`p-2 rounded transition ${
            isSpeaking ? "bg-red-200" : "hover:bg-gray-200"
          }`}
          title={isSpeaking ? "Stop reading" : "Read question"}
        >
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
}
