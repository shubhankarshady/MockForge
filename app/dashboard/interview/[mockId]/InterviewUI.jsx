"use client";

import { Lightbulb, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InterviewUI({ interview }) {
  const params = useParams();
  const mockId = params.mockId;

  return (
    <div className="my-10 px-6">
      <h2 className="font-bold text-2xl mb-8 text-center">Let's get started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* LEFT SIDE – Job Info */}
        <div className="flex flex-col gap-4 p-6 rounded-lg border">
          <h2 className="text-lg">
            <strong>Job Role/Position:</strong> {interview.jobPosition}
          </h2>

          <h2 className="text-lg">
            <strong>Job Description / Tech Stack:</strong> {interview.jobDesc}
          </h2>

          <h2 className="text-lg">
            <strong>Years of Experience:</strong> {interview.jobExperiance}
          </h2>

          <div className="mt-6 p-4 bg-secondary rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb />
              <strong>Information</strong>
            </div>

            <p className="text-sm text-muted-foreground">
              This interview contains 5 questions. Answer them honestly to receive
              a performance report at the end.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – Start Interview */}
        <div className="flex flex-col items-center justify-center gap-4 border rounded-lg p-10">

          <Link href={`/dashboard/interview/${mockId}/start`}>
            <Button className="flex gap-2 items-center w-60">
              <PlayCircle size={18} />
              Start Interview
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
}
