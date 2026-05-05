import { db } from "@/lib/db/index";
import { MockInterview, UserAnswer } from "@/lib/db/schema/index";
import { eq } from "drizzle-orm";
import InterviewFeedback from "@/components/shared/InterviewFeedback";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Feedback({ params }) {
  const { mockId } = await params;

  // Try to fetch AI feedback from MockInterview
  const interviewResult = await db
    .select({ aifeedback: MockInterview.aifeedback })
    .from(MockInterview)
    .where(eq(MockInterview.mockId, mockId));

  let feedbackData = null;
  if (interviewResult.length > 0 && interviewResult[0].aifeedback) {
    try {
      feedbackData = typeof interviewResult[0].aifeedback === 'string' 
        ? JSON.parse(interviewResult[0].aifeedback) 
        : interviewResult[0].aifeedback;
    } catch (e) {
      console.error("Failed to parse aifeedback JSON", e);
    }
  }

  // Fallback: If no AI feedback exists yet in the new format, generate it dynamically from UserAnswer
  if (!feedbackData) {
    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, mockId))
      .orderBy(UserAnswer.id);

    if (answers.length > 0) {
      const avgRating = answers.reduce((sum, r) => sum + Number(r.rating || 0), 0) / answers.length;
      feedbackData = {
        overall_score: Math.round(avgRating * 10),
        summary: "This is a dynamically generated summary based on your previous answers.",
        strengths: ["Completed Assessment"],
        weaknesses: ["Needs targeted AI feedback generation"],
        qa_breakdown: answers.map(item => ({
          question: item.questions || item.question,
          userans: item.userAns,
          correctans: item.correctAns,
          feedback: item.feedback,
          rating: Number(item.rating),
          sentiment: Number(item.rating) >= 7 ? "Confident" : "Needs Practice",
          technical_keywords: []
        }))
      };
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 mb-20 mt-4">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-[15px]">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>

      {feedbackData ? (
        <InterviewFeedback feedbackData={feedbackData} />
      ) : (
        <div className="text-center p-12 bg-white border-[2px] border-slate-200 border-dashed rounded-3xl mt-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">No Feedback Available</h2>
          <p className="text-[15px] text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">We couldn't find any recorded answers or AI feedback. Ensure you've completed this interview session.</p>
          <Link href="/dashboard" className="mt-6 inline-block">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Return to Dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
