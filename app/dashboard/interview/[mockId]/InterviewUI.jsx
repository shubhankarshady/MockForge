"use client";

import { useState } from "react";
import Webcam from "react-webcam";
import { Camera, Lightbulb, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewUI({ interview }) {
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  return (
    <div className="my-10 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl mb-6">Let's get started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2">

        

            <div className="flex flex-col my-5 gap-5 p-5 rounded-lg border">

                 {!webCamEnabled ? (
        // Enable webcam UI
        <div
          onClick={() => setWebCamEnabled(true)}
          className="h-72 w-72 flex flex-col items-center justify-center bg-secondary rounded-lg border cursor-pointer hover:bg-gray-200 transition"
        > 
           
          <Camera size={48}  />
          <p className="mt-2">Enable Webcam & Mic</p>
        </div>
      ) : (
        // Webcam + Stop button UI
        <div className="flex flex-col items-center gap-4">
          <Webcam
          
            className="h-72 w-72 rounded-lg border"
            audio={false}
            mirrored = {true}
          />

          <Button
            variant="destructive"
            onClick={() => setWebCamEnabled(false)}
            className="flex gap-2 items-center"
          >
            <StopCircle size={18} />
            Stop Webcam
          </Button>
        </div>
      )}


        <h2 className="text-lg"><strong>Job Role/Position:</strong> {interview.jobPosition}</h2>
         <h2 className="text-lg"><strong>Job Description/ Tech Stack:</strong> {interview.jobDesc}</h2>
          <h2 className="text-lg"><strong>Years of Experiance:</strong> {interview.jobExperiance}</h2>
      </div>
      
      <div>
        <h2><Lightbulb/><strong>Information</strong></h2>
        <h2>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
      </div>

      </div>

      

      
    </div>
  );
}
