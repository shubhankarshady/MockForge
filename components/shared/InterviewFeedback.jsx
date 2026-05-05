"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Lightbulb, TrendingUp, TrendingDown, 
  ChevronDown, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function InterviewFeedback({ feedbackData: initialFeedback, testId }) {
  const [feedbackData, setFeedbackData] = useState(initialFeedback || null);

  useEffect(() => {
    if (initialFeedback) {
      setFeedbackData(initialFeedback);
    } else if (testId) {
      fetchFeedback();
    }
  }, [initialFeedback, testId]);

  const fetchFeedback = async () => {
    try {
      // As requested:
      const { data, error } = await supabase
        .from('mockinterview')
        .select('aifeedback')
        .eq('mockid', testId)
        .single();

      if (data && data.aifeedback) {
        // data.aifeedback already matches the format your component needs!
        let parsedFeedback = data.aifeedback;
        if (typeof parsedFeedback === 'string') {
          try {
            parsedFeedback = JSON.parse(parsedFeedback);
          } catch (e) {
            console.error("Failed to parse aifeedback JSON", e);
          }
        }
        setFeedbackData(parsedFeedback);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!feedbackData) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-4">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-10 flex flex-col items-center justify-center text-center isolate">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-100/50 blur-3xl -z-10 rounded-full mix-blend-multiply" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-100/50 blur-3xl -z-10 rounded-full mix-blend-multiply" />
        
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-indigo-100/50">
          <Trophy className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h2 className="text-[12px] uppercase tracking-widest font-bold text-slate-500 mb-2">Overall Score</h2>
        <div className="text-[64px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 leading-none mb-4">
          {feedbackData.overall_score} <span className="text-3xl text-slate-300">/ 100</span>
        </div>
      </div>

      {/* 2. AI Insights & Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2.5 bg-white rounded-xl shadow-sm border border-indigo-100">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-indigo-400 mb-2">AI Summary Insight</h3>
            <p className="text-lg text-slate-700 italic leading-relaxed">
              "{feedbackData.summary}"
            </p>
          </div>
        </div>
      </div>

      {/* 3. Strengths & Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 tracking-tight">Key Strengths</h3>
          </div>
          <ul className="space-y-4">
            {feedbackData.strengths?.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 tracking-tight">Areas for Growth</h3>
          </div>
          <ul className="space-y-4">
            {feedbackData.weaknesses?.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3 text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Detailed Q&A Review */}
      <div className="space-y-6 pt-6">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
          Detailed Q&A Review
        </h3>
        
        <div className="space-y-4">
          {feedbackData.qa_breakdown?.map((item, idx) => (
            <Collapsible key={idx} className="group bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all hover:shadow-lg hover:border-slate-300">
              <CollapsibleTrigger className="w-full p-6 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/50 rounded-2xl transition-colors">
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-[15px] sm:text-base leading-snug pr-4">
                    {item.question}
                  </h4>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 border
                    ${item.rating >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      item.rating >= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {item.rating}/10
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-6 pb-6 space-y-6">
                <div className="pt-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Answer */}
                    <div className="relative bg-slate-50 border border-slate-200/60 rounded-2xl p-5 pl-6 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300" />
                      <h5 className="text-[12px] uppercase tracking-widest font-bold text-slate-500 mb-2">Your Answer</h5>
                      <p className="text-slate-700 leading-relaxed text-sm">{item.userans}</p>
                    </div>
                    
                    {/* Correct Answer */}
                    <div className="relative bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5 pl-6 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                      <h5 className="text-[12px] uppercase tracking-widest font-bold text-indigo-500 mb-2">Expected Answer</h5>
                      <p className="text-slate-700 leading-relaxed text-sm">{item.correctans}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback & Insights */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      <h5 className="font-bold text-slate-800 text-sm">AI Feedback & Insights</h5>
                    </div>
                    
                    {item.sentiment && (
                      <span className="sm:ml-auto w-fit text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm">
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{item.feedback}</p>
                  
                  {item.technical_keywords?.length > 0 && (
                    <div>
                      <h6 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2.5">Keywords Detected</h6>
                      <div className="flex flex-wrap gap-2">
                        {item.technical_keywords.map((keyword, kIdx) => (
                          <span key={kIdx} className="text-[11px] font-medium bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md shadow-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
