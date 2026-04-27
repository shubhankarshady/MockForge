"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, LoaderCircle, Clock, Briefcase, CalendarDays, ArrowRight } from "lucide-react";
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
    console.log("Delete button clicked for mockId:", mockId);
    if (window.confirm("Are you sure you want to delete this interview?")) {
      try {
        const result = await deleteMockInterview(mockId);
        console.log("Delete result:", result);
        if (result.success) {
          toast.success("Interview deleted successfully");
          fetchInterviews(); // Refresh the list
        } else {
          toast.error("Failed to delete interview: " + result.error);
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-100">
          <Clock size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Previous Mock Interviews
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList.length > 0 ? (
            interviewList.map((item) => (
              <div
                key={item.mockId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200"
              >
                {/* Background Decor */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteInterview(item.mockId);
                  }}
                  className="absolute right-4 top-4 rounded-full bg-red-50 p-2 text-red-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 z-20"
                  title="Delete Interview"
                >
                  <Trash2 size={16} />
                </button>

                <div className="relative z-10">
                  {/* Job Title */}
                  <h3 className="pr-8 text-[19px] font-bold text-slate-800 line-clamp-1">
                    {item.jobPosition}
                  </h3>
                  
                  {/* Experience */}
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Briefcase size={14} className="text-slate-400" />
                    <span>{item.jobExperience} Years Experience</span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {item.jobDesc}
                  </p>
                </div>

                <div className="relative z-10 mt-6 border-t border-slate-100 pt-5">
                  <div className="mb-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <CalendarDays size={13} />
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/interview/${item.mockId}/feedback`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-slate-200 shadow-sm transition-all"
                      >
                        Feedback
                      </Button>
                    </Link>

                    <Link
                      href={`/dashboard/interview/${item.mockId}/start`}
                      className="flex-1"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all gap-2"
                      >
                        Start <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                 <Briefcase size={24} />
               </div>
               <h3 className="text-lg font-semibold text-slate-800">No mock interviews yet</h3>
               <p className="mt-1 text-sm text-slate-500 max-w-sm">Create your first AI mock interview to start practicing and tracking your progress.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
