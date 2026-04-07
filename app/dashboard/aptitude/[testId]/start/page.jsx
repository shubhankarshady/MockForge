"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { fetchAptitudeQuestions, submitAptitudeTest } from "@/lib/actions/aptitude";
import { Button } from "@/components/ui/button";
import { 
  LoaderCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Timer, 
  AlertCircle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function StartAptitudeTest() {
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const { user } = useUser();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Stores { index: selectedOptionValue }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Timer state (35 minutes)
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (category) {
      loadQuestions();
    }
  }, [category]);

  // Timer Effect
  useEffect(() => {
    if (loading || submitting || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting, questions.length]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await fetchAptitudeQuestions(category);
      
      if (data && Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error("API did not return an array:", data);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
      toast.error("Failed to load questions. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionValue) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionValue,
    }));
  };

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setShowConfirmDialog(false);

    const formattedAnswers = questions.map((q, index) => ({
      question: q.question,
      correct_answer: q.answer, // API uses 'answer'
      user_answer: userAnswers[index] || null,
    }));

    try {
      const result = await submitAptitudeTest({
        mockId: testId,
        category: category,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        questions: formattedAnswers,
      });

      if (result.success) {
        toast.success("Test submitted successfully!");
        router.push(`/dashboard/aptitude/${testId}/feedback`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [questions, userAnswers, testId, category, user, router]);

  const handleAutoSubmit = () => {
    toast.info("Time is up! Autosubmitting your test...");
    handleSubmit();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getUnattemptedIndexes = () => {
    const unattempted = [];
    questions.forEach((_, index) => {
      if (!userAnswers[index]) {
        unattempted.push(index + 1);
      }
    });
    return unattempted;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary mb-4" />
        <p className="text-gray-500">Fetching your {category} questions...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">No questions found for this category.</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const unattempted = getUnattemptedIndexes();
  const attemptedCount = questions.length - unattempted.length;

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto pb-32">
      {/* Sticky Timer Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b mb-10 py-4 flex justify-between items-center px-4 -mx-4">
        <div>
          <h2 className="text-xl font-bold capitalize">{category} Assessment</h2>
          <p className="text-xs text-gray-500 hidden md:block">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-colors ${
          timeLeft < 300 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-primary/5 text-primary border-primary/20"
        }`}>
          <Timer size={18} />
          <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-8 shadow-sm">
        <h3 className="text-xl font-medium mb-8 leading-relaxed">{currentQuestion.question}</h3>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options && Array.isArray(currentQuestion.options) ? (
            currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                  userAnswers[currentQuestionIndex] === option
                    ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                  userAnswers[currentQuestionIndex] === option ? "bg-primary text-white border-primary" : "bg-secondary"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            ))
          ) : (
            <p className="text-red-500">Error loading options for this question.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-10">
        <Button
          variant="outline"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white" 
            disabled={submitting}
            onClick={() => setShowConfirmDialog(true)}
          >
            {submitting ? (
              <><LoaderCircle className="animate-spin mr-2 h-4 w-4" /> Submitting...</>
            ) : (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Finish Test</>
            )}
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-12 flex flex-wrap gap-2 justify-center">
        {questions.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentQuestionIndex(idx)}
            className={`h-10 w-10 flex items-center justify-center border rounded-md cursor-pointer transition-all ${
              currentQuestionIndex === idx ? "bg-primary text-white border-primary shadow-md" : 
              userAnswers[idx] ? "bg-green-50 border-green-200 text-green-700" : "bg-card hover:bg-secondary text-muted-foreground"
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="text-yellow-500" />
              Finish Test?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4">
                <p className="text-foreground font-medium mb-4 text-base">
                  Are you sure you want to submit your test?
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Attempted</p>
                    <p className="text-2xl font-bold text-green-700">{attemptedCount}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Unattempted</p>
                    <p className="text-2xl font-bold text-red-700">{unattempted.length}</p>
                  </div>
                </div>

                {unattempted.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">Unattempted Questions:</p>
                    <div className="flex flex-wrap gap-1">
                      {unattempted.map((num) => (
                        <span key={num} className="h-6 w-6 flex items-center justify-center bg-secondary rounded text-xs font-medium">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-end mt-6">
                  <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
                    Go Back
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    Confirm & Submit
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
