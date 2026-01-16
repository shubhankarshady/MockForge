"use client";

import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function SpeechRecorder({ mockId, activeQuestion, user }) {
  const {
    error,
    interimResult,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: true,
  });

  const transcriptRef = useRef("");
  const lastInterimRef = useRef("");

  // accumulate latest hypothesis
  if (interimResult && interimResult !== lastInterimRef.current) {
    transcriptRef.current = interimResult;
    lastInterimRef.current = interimResult;
    console.log("Live:", interimResult);
  }

  const handleStart = () => {
    transcriptRef.current = "";
    lastInterimRef.current = "";
    startSpeechToText();
  };

  // 👇 Gemini API call helper
  const sendForEvaluation = async (data) => {
  const res = await fetch("/api/evaluate-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};


  const handleStop = () => {
    stopSpeechToText();

    setTimeout(async () => {
      const text = transcriptRef.current.trim();

      console.log("Final Answer:", text);

      const wordCount = text.split(/\s+/).filter(Boolean).length;

      if (wordCount < 10) {
        toast.error("Answer too short", {
          description: "Speak at least 10 words before stopping the recording.",
        });
        return;
      }
      try {
  console.log("Sending to Gemini...");

  const result = await sendForEvaluation({
    mockId: mockId,
    question: activeQuestion.question,
    correctAns: activeQuestion.answer,
    userAnswer: text,
    userEmail: user?.email || "anonymous",
  });

  console.log("Gemini Result:", result);
  console.log("Rating:", result.rating);
  console.log("Feedback:", result.feedback);

  toast.success("Answer recorded successfully", {
    description: "Your response has been evaluated and saved.",
  });

}

       catch (err) {
        console.error("Gemini error:", err);
        toast.error("Failed to evaluate answer");
      }

    }, 300);
  };

  if (error) console.error("Speech error:", error);

  return (
    <div className="border rounded-lg p-5 flex flex-col gap-4">
      <h2 className="font-bold text-lg">Record Your Answer</h2>

      <div className="flex gap-3">
        <Button onClick={handleStart} disabled={isRecording}>
          <Mic size={16} /> Start Recording
        </Button>

        <Button
          variant="destructive"
          onClick={handleStop}
          disabled={!isRecording}
        >
          <Square size={16} /> Stop Recording
        </Button>
      </div>
    </div>
  );
}
