"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SpotlightWrapper from "@/components/animations/SpotlightWrapper";

import { createMockInterview } from "@/lib/actions/interview";

function AddNewInterview() {
  const { user } = useUser();

  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperiance, setJobExperiance] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("jobPosition", jobPosition);
    formData.append("jobDesc", jobDesc);
    formData.append("jobExperience", jobExperiance);
    formData.append("createdBy", user?.primaryEmailAddress?.emailAddress);

    try {
      const result = await createMockInterview(formData);

      if (result.success) {
        router.push(`/dashboard/interview/${result.mockId}`);
        setOpenDialog(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Failed to create interview:", err);
      alert("Failed to generate interview. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     <SpotlightWrapper>
       <div
          className="border-white"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-white text-center">+ Add new</h2>
      </div>
     </SpotlightWrapper>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] rounded-3xl overflow-hidden p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="p-8 relative">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Tell us more about your job interview
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400 mt-2">
                Add details about your job position, job description and
                years of experience to generate tailored questions.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-300 mb-2 block group-focus-within:text-white transition-colors">
                    Job Role / Job Position
                  </label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                    className="bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 h-12 rounded-xl transition-all"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-300 mb-2 block group-focus-within:text-white transition-colors">
                    Job Description / Tech Stack
                  </label>
                  <Textarea
                    placeholder="Ex. React, Node.js etc"
                    required
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 min-h-[120px] resize-none rounded-xl transition-all"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-300 mb-2 block group-focus-within:text-white transition-colors">
                    Years of Experience
                  </label>
                  <Input
                    placeholder="Ex. 2"
                    type="number"
                    max="50"
                    required
                    onChange={(e) => setJobExperiance(e.target.value)}
                    className="bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 h-12 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-4 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl px-6"
                >
                  Cancel
                </Button>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white hover:bg-gray-200 text-black font-semibold shadow-lg shadow-white/10 rounded-xl px-8 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
