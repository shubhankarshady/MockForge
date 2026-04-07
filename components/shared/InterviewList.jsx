"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SpotlightWrapper from "@/components/animations/SpotlightWrapper";
import { Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { getInterviewList, deleteMockInterview } from "@/lib/actions/interview";

export default function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const result = await getInterviewList(email);
      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteInterview = async (mockId) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      try {
        const result = await deleteMockInterview(mockId);
        if (result.success) {
          toast.success("Interview deleted successfully");
          fetchInterviews(); // Refresh the list
        } else {
          toast.error("Failed to delete interview");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-semibold text-xl text-neutral-200 mb-4">
        Previous Mock Interviews
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoaderCircle className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewList.length > 0 ? (
            interviewList.map((item) => (
              <SpotlightWrapper key={item.mockId}>
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
                    relative group
                  "
                >
                  <button 
                    onClick={() => onDeleteInterview(item.mockId)}
                    className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Delete Interview"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Job Title */}
                  <p className="font-semibold text-neutral-100 text-lg pr-8">
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
                    Created at: {new Date(item.createdAt).toLocaleString()}
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
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-neutral-500 border rounded-lg border-dashed border-neutral-800">
              No mock interviews found. Add one to get started!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
