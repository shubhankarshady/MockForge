"use client";

import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Camera, Lightbulb, StopCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function InterviewUI({ interview }) {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const webcamRef = useRef(null);
  const params = useParams();
  const mockId = params.mockId;

  const stopWebcam = () => {
    const stream = webcamRef.current?.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setWebCamEnabled(false);
  };

  

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
              Enable video webcam and microphone to start the interview.
              It has 5 questions which you can answer and at the end you will get
              a report based on your answers.
            </p>

            <p className="text-sm text-muted-foreground mt-2 font-semibold">
              NOTE: We never record your video.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE – Webcam */}
        <div className="flex flex-col items-center gap-4">

          {!webCamEnabled ? (
            <div
              onClick={() => setWebCamEnabled(true)}
              className="h-72 w-72 flex flex-col items-center justify-center bg-secondary rounded-lg border cursor-pointer hover:bg-gray-200 transition"
            >
              <Camera size={48} />
              <p className="mt-2 font-medium">Enable Webcam & Mic</p>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                className="h-72 w-72 rounded-lg border"
                audio={true}
                 muted={true} 
                mirrored={true}
              />

              <div className="flex flex-col gap-3 w-full items-center">
                <Link href={`/dashboard/interview/${mockId}/start`} >
                  <Button
                  variant="default"
                  className="flex gap-2 items-center w-60"
                  disabled={!webCamEnabled}
                  
                >
                  <PlayCircle size={18} />
                  Start Interview
                </Button>
                </Link>
                
                <Button
                  variant="destructive"
                  onClick={stopWebcam}
                  className="flex gap-2 items-center w-60"
                >
                  <StopCircle size={18} />
                  Stop Webcam & Mic
                </Button>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
