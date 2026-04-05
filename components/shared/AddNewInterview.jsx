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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>

            <DialogDescription asChild>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position, job description and
                    years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role / Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label>Job Description / Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React, Node.js etc"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex. 2"
                      type="number"
                      max="50"
                      required
                      onChange={(e) => setJobExperiance(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
