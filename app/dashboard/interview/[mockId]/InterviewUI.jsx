"use client";

import { Lightbulb, PlayCircle, Briefcase, FileCode2, Clock, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";

export default function InterviewUI({ interview }) {
  const params = useParams();
  const mockId = params.mockId;

  return (
    <div className="my-10 max-w-5xl mx-auto px-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          SETUP
        </div>
        <h2 className="font-bold text-3xl md:text-4xl text-slate-800 tracking-tight">Let's get started</h2>
        <p className="mt-3 text-slate-500 max-w-md">Review your interview details and ensure you're ready before proceeding.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">

        {/* LEFT SIDE – Job Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-3 flex flex-col gap-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-2">Job Details</h3>
          
          <div className="flex flex-col gap-5">
            {/* Job Role */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/50 text-blue-600 ring-1 ring-blue-100">
                <Briefcase size={22} />
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Job Role / Position</span>
                <span className="text-lg font-bold text-slate-800 mt-0.5">{interview.jobPosition}</span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Tech Stack */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50/50 text-purple-600 ring-1 ring-purple-100">
                <FileCode2 size={22} />
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Job Description / Tech Stack</span>
                <span className="text-[15px] font-medium text-slate-700 mt-1 leading-relaxed">{interview.jobDesc}</span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Experience */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50/50 text-orange-600 ring-1 ring-orange-100">
                <Clock size={22} />
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Years of Experience</span>
                <span className="text-lg font-bold text-slate-800 mt-0.5">{interview.jobExperience} Years</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-4 rounded-2xl border border-yellow-200/60 bg-yellow-50/50 p-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <Lightbulb size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800">Important Information</h4>
              <p className="mt-1 text-[13px] text-yellow-800/70 leading-relaxed">
                This interview roughly contains 5 questions. Answer them honestly to receive
                a detailed performance report at the end. Enable your camera and microphone when prompted.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE – Start Interview CTA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-2"
        >
          <div className="flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
            
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
              {/* Rotating dashed ring */}
              <div className="absolute inset-[-10px] rounded-full border-[1.5px] border-blue-200 border-dashed animate-[spin_10s_linear_infinite]" />
              <Camera size={32} className="text-blue-500 drop-shadow-sm" />
            </div>
            
            <div className="relative z-10 mt-2">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Ready to begin?</h3>
              <p className="mt-2 text-[14px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                Ensure your environment is quiet, well-lit, and distraction-free.
              </p>
            </div>

            <Link href={`/dashboard/interview/${mockId}/start`} className="relative z-10 w-full mt-4">
              <Button className="w-full flex gap-2 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all rounded-xl text-base font-semibold group-hover:-translate-y-0.5">
                <PlayCircle size={22} />
                Start Your Interview
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
