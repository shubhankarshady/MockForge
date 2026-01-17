import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InterviewList() {
  const user = await currentUser();

  if (!user) return null;

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
    .orderBy(desc(MockInterview.id));

  return (
    <div>
      <h2 className="font-medium text-lg mb-3">Previous Mock Interviews</h2>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
        {result.map((item) => (
          <div key={item?.id} className="border shadow-sm rounded-lg p-3 ">
            <p className="font-bold text-primary">{item?.jobPosition}</p>
            <p className="text-sm font-bold">
              {item?.jobDesc}
              
            </p>
            <p className="text-sm text-gray-600 ">Years of experience: {item?.jobExperiance} </p>
            <p className="text-xs text-gray-500">Created at: {item?.createdAt.toLocaleString()}</p>
            <div className="flex justify-between mt-2">
              <Link href={`/dashboard/interview/${item.mockId}/feedback`}>
              <Button size="sm" variant="outline">Feedback</Button>
              </Link>

              <Link href={`/dashboard/interview/${item.mockId}/start`}>
              <Button size="sm" >Start</Button></Link>
              

            </div>  
          </div>
        ))}
      </div>
    </div>
  );
}
