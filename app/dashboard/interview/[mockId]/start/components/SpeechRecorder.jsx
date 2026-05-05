"use client";

import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import { Mic, Square, LoaderCircle, Radio } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { saveUserAnswer } from "@/lib/actions/answer";

export default function SpeechRecorder({ mockId, activeQuestion, user, onStateChange }) {
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

  const [isEvaluating, setIsEvaluating] = useState(false);
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
    if (onStateChange) onStateChange(true);
  };

  const handleStop = async () => {
    stopSpeechToText();
    setIsEvaluating(true);

    setTimeout(async () => {
      const text = transcriptRef.current.trim();
      console.log("Final Answer:", text);

      const wordCount = text.split(/\s+/).filter(Boolean).length;

      if (wordCount < 10) {
        setIsEvaluating(false);
        if (onStateChange) onStateChange(false);
        toast.error("Answer too short", {
          description: "Speak at least 10 words before stopping the recording.",
        });
        return;
      }

      try {
        console.log("Sending for evaluation...");

        const result = await saveUserAnswer({
          mockId: mockId,
          question: activeQuestion.question,
          correctAns: activeQuestion.answer,
          userAns: text,
          userEmail: user?.primaryEmailAddress?.emailAddress || "anonymous",
        });

        if (result.success) {
          console.log("Evaluation Result:", result.evaluation);
          toast.success("Answer recorded successfully", {
            description: "Your response has been evaluated and saved.",
          });
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        toast.error("Failed to evaluate answer");
      } finally {
        setIsEvaluating(false);
        if (onStateChange) onStateChange(false);
      }
    }, 300);
  };

  if (error) console.error("Speech error:", error);

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[350px] w-full rounded-2xl bg-slate-50/50 border border-slate-100 shadow-inner p-8">
      
      {/* Visual State Indicator */}
      <div className="relative flex items-center justify-center h-32 w-32 rounded-full bg-white shadow-sm ring-1 ring-slate-100">
        {isRecording ? (
           <div className="absolute inset-0 rounded-full border-[3px] border-red-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        ) : null}
        
        <div className={`flex items-center justify-center h-24 w-24 rounded-full transition-colors duration-500 ${isRecording ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
           <Mic size={40} className={isRecording ? 'animate-pulse' : ''} />
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-xl text-slate-800 tracking-tight">Record Your Answer</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm px-4 h-10">
          {isEvaluating 
             ? "Evaluating your response..." 
             : isRecording 
                ? "Recording in progress... speak clearly." 
                : "Click start when you are fully ready to answer."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <Button 
           onClick={handleStart} 
           disabled={isRecording || isEvaluating}
           className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-8 h-12 gap-2 transition-all disabled:opacity-50"
        >
          {isEvaluating ? (
             <LoaderCircle className="animate-spin" size={18} />
          ) : (
             <Radio size={18} />
          )}
           Start Recording
        </Button>

        <Button
          variant="destructive"
          onClick={handleStop}
          disabled={!isRecording || isEvaluating}
          className="bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 rounded-xl px-8 h-12 gap-2 transition-all"
        >
          <Square size={18} /> Stop Recording
        </Button>
      </div>
    </div>
  );
}
