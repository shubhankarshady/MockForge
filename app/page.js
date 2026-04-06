"use client";

import { useRef } from "react";
import SplitText from "@/components/animations/SplitText";
import Navbar from "@/components/shared/Navbar";
import AmbientBackground from "@/components/shared/AmbientBackground";
import GsapMagnetic from "@/components/animations/GsapMagnetic";
import Link from "next/link";
import { motion } from 'motion/react';
import { ArrowRight, Play } from "lucide-react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const container = useRef();

  useGSAP(() => {
    // Elegant entrance stagger using GSAP
    gsap.from(".gsap-element", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.9 // Wait for SplitText to start smoothly
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative min-h-screen w-full bg-[#050505] overflow-hidden text-[#ececec]">

      <AmbientBackground />

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-6 lg:px-8 mt-[-5vh]">

        {/* Sleek Minimalist Badge */}
        <div className="gsap-element mb-8 p-[1px] rounded-full bg-gradient-to-r from-transparent via-neutral-500/40 to-transparent">
          <div className="bg-[#050505]/80 backdrop-blur-md rounded-full px-5 py-1.5 border border-white/5 flex items-center gap-2 text-sm text-neutral-300 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            AI Powered Interview Mastery
          </div>
        </div>

        {/* Clean Monochromatic Title Animation */}
        <SplitText
          text="Perfect Your Pitch,"
          className="text-5xl md:text-7xl font-semibold text-white/90 text-center tracking-tight leading-tight mb-0"
          delay={25}
          duration={1.2}
          ease="power4.out"
          splitType="words"
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
        />
        <SplitText
          text="Land The Offer."
          className="text-5xl md:text-7xl font-semibold text-white/90 text-center tracking-tight leading-tight mb-8"
          delay={25}
          duration={1.2}
          ease="power4.out"
          splitType="words"
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
        />

        {/* Subtitle */}
        <div className="gsap-element mt-4 text-[#a3a3a3] max-w-2xl text-center text-lg md:text-xl font-light leading-relaxed">
          MockForge uses generative AI to simulate real-world interviews. Get instant personalized feedback, build confidence, and land your dream job faster.
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center">
          <div className="gsap-element">
            <GsapMagnetic strength={0.25}>
              <Link href="/dashboard">
                {/* Sleek button with animated gradient bezel matching the neutral aesthetic */}
                <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform hover:scale-105 active:scale-95">
                  <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#050505_0%,#ffffff_50%,#050505_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#0a0a0a] px-8 py-2 text-base font-medium text-white backdrop-blur-3xl transition-colors gap-2 group-hover:bg-[#111111]">
                    Start Practicing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </GsapMagnetic>
          </div>

          {/* <div className="gsap-element">
            <GsapMagnetic strength={0.15}>
              <button className="group inline-flex h-14 items-center justify-center rounded-full px-8 py-2 text-base font-medium text-neutral-300 transition-colors hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 gap-2">
                 <Play className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                 Watch Demo
              </button>
            </GsapMagnetic>
          </div> */}
        </div>
      </main>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
}
