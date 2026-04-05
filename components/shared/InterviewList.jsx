import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SpotlightWrapper from "@/components/animations/SpotlightWrapper";

export default async function InterviewList() {
  const user = await currentUser();

  if (!user) return null;

  const result = await db
    .select()
    .from(MockInterview)
    .where(
      eq(
        MockInterview.createdBy,
        user.primaryEmailAddress.emailAddress
      )
    )
    .orderBy(desc(MockInterview.id));

  return (
    <div>
      <h2 className="font-semibold text-xl text-neutral-200 mb-4">
        Previous Mock Interviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.map((item) => (
          <SpotlightWrapper key={item.id}>
            <div
              className="
                bg-neutral-900/80
                backdrop-blur-sm
                border border-neutral-800
                rounded-xl
                p-5
                transition-all duration-300
                hover:border-purple-500/40
                shadow-md hover:shadow-purple-500/10
              "
            >
              {/* Job Title */}
              <p className="font-semibold text-neutral-100 text-lg">
                {item.jobPosition}
              </p>

              {/* Description */}
              <p className="text-sm text-neutral-300 mt-1">
                {item.jobDesc}
              </p>

              {/* Experience */}
              <p className="text-sm text-neutral-400 mt-2">
                Years of experience: {item.jobExperiance}
              </p>

              {/* Date */}
              <p className="text-xs text-neutral-500 mt-1">
                Created at: {item.createdAt.toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-5">
                <Link
                  href={`/dashboard/interview/${item.mockId}/feedback`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="
                      border-neutral-700
                      text-neutral-300
                      bg-neutral-900/40
                      hover:bg-neutral-800
                      hover:text-neutral-100
                      transition-all
                    "
                  >
                    Feedback
                  </Button>
                </Link>

                <Link
                  href={`/dashboard/interview/${item.mockId}/start`}
                >
                  <Button
                    size="sm"
                    className="
                      bg-[#5227FF]
                      hover:bg-[#6b46ff]
                      text-neutral-100
                      shadow-lg
                      hover:shadow-purple-500/20
                      transition-all
                    "
                  >
                    Start
                  </Button>
                </Link>
              </div>
            </div>
          </SpotlightWrapper>
        ))}
      </div>
    </div>
  );
}