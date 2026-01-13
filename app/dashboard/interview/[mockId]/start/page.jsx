import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import StartInterviewClient from "./StartInterviewClient";

export default async function StartInterview({ params }) {
  const { mockId } = await params;

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, mockId));

  if (!result.length) {
    return <div>Interview not found</div>;
  }

  return <StartInterviewClient interview={result[0]} />;
}
