import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { eq } from "drizzle-orm";
import InterviewUI from "./InterviewUI";

export default async function InterviewPage({ params }) {
  const { mockId } = await params;

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, mockId));

  const interview = result[0];

  if (!interview) {
    return <div className="p-10">Interview not found</div>;
  }

  return <InterviewUI interview={interview} />;
}
