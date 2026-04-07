"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LoaderCircle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Lightbulb, 
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { getAptitudeFeedback } from "@/lib/actions/aptitude";

export default function AptitudeFeedback() {
  const { testId } = useParams();
  const router = useRouter();
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [testId]);

  const fetchFeedback = async () => {
    try {
      const result = await getAptitudeFeedback(testId);
      setTestData(result.testData);
      setAnswers(result.answers);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary mb-4" />
        <p className="text-gray-500">Loading your results...</p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Feedback not found.</h2>
        <Link href="/dashboard/aptitude">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const percentage = Math.round((testData.score / testData.totalQuestions) * 100);

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto">
      <Link href="/dashboard/aptitude" className="flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft size={18} /> Back to Aptitude Dashboard
      </Link>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
          Congratulations! <Trophy className="text-yellow-500" />
        </h2>
        <p className="text-gray-500 text-lg mt-2">Here is your performance report for the {testData.category} assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Score Card */}
        <div className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Your Final Score</h3>
          <div className="relative h-32 w-32 flex items-center justify-center rounded-full border-8 border-primary/20">
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{testData.score}</span>
                <span className="text-xl text-gray-400">/{testData.totalQuestions}</span>
             </div>
          </div>
          <p className="mt-4 text-lg font-medium">{percentage}% Accuracy</p>
        </div>

        {/* AI Feedback Card */}
        <div className="bg-secondary/30 border border-primary/20 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Lightbulb size={24} />
            <h3 className="text-xl font-semibold">AI Insights</h3>
          </div>
          <p className="text-gray-700 leading-relaxed italic">
            "{testData.aiFeedback}"
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6">Detailed Review</h3>
      
      <div className="space-y-4">
        {answers.map((item, index) => (
          <Collapsible key={index} className="border rounded-lg bg-card overflow-hidden shadow-sm">
            <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${item.isCorrect === 'true' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.isCorrect === 'true' ? (
                    <CheckCircle2 className="text-green-600 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-600 h-5 w-5" />
                  )}
                </div>
                <span className="font-medium line-clamp-1">{item.questionText}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-xs px-2 py-1 rounded-full ${item.isCorrect === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.isCorrect === 'true' ? 'Correct' : 'Incorrect'}
                 </span>
                 <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-5 pt-0 border-t bg-secondary/10">
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-white border rounded-md">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Answer</p>
                  <p className={`${item.isCorrect === 'true' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {item.userAnswer.toUpperCase()}
                  </p>
                </div>
                <div className="p-3 bg-white border rounded-md border-green-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Correct Answer</p>
                  <p className="text-green-700 font-bold uppercase">{item.correctAnswer}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-md border border-dashed border-primary/30 mt-4">
                   <p className="text-sm text-gray-600">
                     <strong>Tip:</strong> Always double-check your calculations in {testData.category} questions to avoid small errors.
                   </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Link href="/dashboard/aptitude">
          <Button size="lg">Try Another Category</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">Go to Home Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
