"use client";

import { useState } from "react";

export default function QuestionsSection({ questions }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="border rounded-lg p-5">
        <h2 className="font-bold mb-2">Questions</h2>
        <p className="text-muted-foreground">No questions found.</p>
      </div>
    );
  }

  const activeQuestion = questions[activeIndex];

  return (
    <div className="border rounded-lg p-5">

      <h2 className="font-bold mb-4">Interview Questions</h2>

      {/* Question number buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-3 py-1 rounded border text-sm font-medium transition
              ${
                activeIndex === index
                  ? "bg-primary text-white"
                  : "bg-secondary hover:bg-gray-200"
              }
            `}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      {/* Active question */}
      <div className="p-4 border rounded-md bg-secondary">
        <p className="font-semibold text-lg">
          Q{activeIndex + 1}. {activeQuestion.question}
        </p>

        {/* Optional: show answer later */}
        {/* 
        <p className="mt-3 text-sm text-muted-foreground">
          {activeQuestion.answer}
        </p>
        */}
      </div>

    </div>
  );
}
