import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
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
