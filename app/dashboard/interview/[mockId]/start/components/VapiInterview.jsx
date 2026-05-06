"use client";

import { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Mic, PhoneOff, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { saveUserAnswer } from "@/lib/actions/answer";

// File-scoped instance
const vapi = typeof window !== "undefined" ? new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "") : null;

export default function VapiInterview({ mockId, questions, jobPosition, user, onStateChange }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const transcriptRef = useRef([]);
  
  const propsRef = useRef({ mockId, questions, user, jobPosition });
  useEffect(() => {
    propsRef.current = { mockId, questions, user, jobPosition };
  }, [mockId, questions, user, jobPosition]);

  useEffect(() => {
    if (!vapi) return;

    const handleCallStart = () => {
      console.log("VapiInterview: Call started");
      setIsConnecting(false);
      setActiveCall(true);
      if (onStateChange) onStateChange(true);
      transcriptRef.current = []; // reset transcript on new call
      toast.success("AI Interviewer joined");
    };

    const handleCallEnd = async () => {
      console.log("VapiInterview: Call ended");
      setActiveCall(false);
      setIsConnecting(false);
      toast.info("Interview finished, evaluating your responses...");
      
      const { mockId, questions, user } = propsRef.current;
      const fullTranscript = transcriptRef.current.join("\n");
      
      if (fullTranscript.length > 50) {
        try {
          const formattedQs = Array.isArray(questions) 
            ? questions.map((q, i) => {
                const qText = typeof q === 'string' ? q : (q.question || "");
                return `Q${i + 1}: ${qText}`;
              }).join("\n")
            : "Interview conversation";
            
          const result = await saveUserAnswer({
            mockId: mockId,
            question: formattedQs,
            correctAns: "Comprehensive conversational answer covering all points expected.",
            userAns: fullTranscript,
            userEmail: user?.primaryEmailAddress?.emailAddress || "anonymous"
          });
          
          if (result.success) {
            toast.success("Interview evaluated successfully", {
              description: "Your answers and feedback have been saved."
            });
          } else {
            toast.error("Evaluation failed", { description: result.error });
          }
        } catch (e) {
          toast.error("Failed to save evaluation");
          console.error(e);
        }
      } else {
         toast.warning("Transcript too short", {
           description: "Not enough conversation data to evaluate."
         });
      }
      
      if (onStateChange) onStateChange(false);
    };

    const handleError = (error) => {
      console.error("Vapi Error Event:", error);
      
      let errorMessage = "Connection error. Please check your mic permissions.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        const details = Object.getOwnPropertyNames(error).reduce((acc, key) => {
          acc[key] = error[key];
          return acc;
        }, {});
        
        console.error("Vapi Error Details:", details);
        errorMessage = details.message || details.reason || "Unknown Error";
      }
      
      setIsConnecting(false);
      setActiveCall(false);
      if (onStateChange) onStateChange(false);
      
      toast.error("Vapi Connection Error", {
        description: String(errorMessage).substring(0, 100)
      });
    };

    const handleMessage = (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
         if (message.role === 'user') {
           transcriptRef.current.push(message.transcript);
           console.log("Added user speech to transcript:", message.transcript);
         }
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);
    vapi.on("message", handleMessage);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
      vapi.off("message", handleMessage);
    };
  }, []);

  const handleStartCall = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    // Debugging: Log the exact structure of questions from Supabase
    console.log("VapiInterview: Raw questions prop type:", typeof questions);
    console.log("VapiInterview: Raw questions prop value:", questions);

    if (!vapi || !publicKey || !assistantId || publicKey === "YOUR_VAPI_PUBLIC_KEY" || assistantId === "YOUR_ASSISTANT_ID") {
      toast.error("Vapi Configuration Missing", {
        description: "Please check your .env file."
      });
      return;
    }

    setIsConnecting(true);
    
    // Format questions into a clean string
    const formattedQuestions = Array.isArray(questions) 
      ? questions.map((q, i) => {
          // Handle both string arrays and object arrays
          const qText = typeof q === 'string' ? q : (q.question || JSON.stringify(q));
          return `Question ${i + 1}: ${qText}`;
        }).join("\n")
      : "No questions provided.";
    
    console.log("VapiInterview: Formatted questions for AI:", formattedQuestions);
    
    // Bulletproof override structure using flat systemPrompt
    const assistantOverrides = {
      firstMessage: `Hello! I'm your AI interviewer for the ${jobPosition} position. Are you ready to begin?`,
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        // Using systemPrompt instead of messages array for better reliability in overrides
        systemPrompt: `You are a technical interviewer at MockForge. 
Role: ${jobPosition}.

STRICT INSTRUCTIONS:
1. You must ask these specific questions one by one:
${formattedQuestions}

2. Ask exactly ONE question at a time.
3. Wait for the candidate's response before moving to the next question.
4. Do not invent your own technical questions.
5. Keep your tone professional and encouraging.
6. When all questions are finished, thank the candidate and end the call.`
      }
    };

    try {
      console.log("VapiInterview: Starting call with assistantId:", assistantId);
      await vapi.start(assistantId, assistantOverrides);
    } catch (err) {
      console.error("VapiInterview: vapi.start failed", err);
      // Fallback: Try without overrides
      try {
        console.warn("VapiInterview: Fallback - starting without overrides");
        await vapi.start(assistantId);
      } catch (retryErr) {
        setIsConnecting(false);
        toast.error("Failed to start AI call");
      }
    }
  };

  const handleEndCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[350px] w-full rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 shadow-inner p-8">
      
      <div className="relative flex items-center justify-center h-32 w-32 rounded-full bg-white shadow-md ring-1 ring-blue-100">
        {activeCall ? (
           <div className="absolute inset-0 rounded-full border-[3px] border-blue-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        ) : null}
        
        <div className={`flex items-center justify-center h-24 w-24 rounded-full transition-all duration-500 ${activeCall ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
           {isConnecting ? <LoaderCircle className="animate-spin" size={40} /> : <Mic size={40} />}
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Sparkles size={18} className="text-blue-500" />
           <h2 className="font-bold text-xl text-slate-800 tracking-tight">AI Voice Interview</h2>
        </div>
        <p className="text-sm text-slate-600 mt-2 max-w-sm px-4">
          {activeCall 
             ? "The AI is listening. Speak naturally as if in a real interview." 
             : "Have a real-time voice conversation with our AI interviewer."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 w-full mt-4">
        {!activeCall ? (
          <Button 
            onClick={handleStartCall} 
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 rounded-2xl px-10 h-14 gap-3 transition-all font-bold text-lg"
          >
            {isConnecting ? <LoaderCircle className="animate-spin" size={22} /> : <Mic size={22} />}
            Start Voice Interview
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/25 rounded-2xl px-10 h-14 gap-3 transition-all font-bold text-lg"
          >
            <PhoneOff size={22} /> End Interview
          </Button>
        )}
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2 bg-white/50 px-3 py-1 rounded-full border border-slate-100">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        Powered by Vapi AI Real-time Voice
      </div>
    </div>
  );
}
