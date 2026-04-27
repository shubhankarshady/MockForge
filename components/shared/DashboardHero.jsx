"use client";

import SplitText from "@/components/animations/SplitText";
import GradientText from "@/components/animations/GradientText";
import { motion } from "motion/react";

export default function DashboardHero() {
  const handleAnimationComplete = () => {};

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
      
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-100/50 blur-[80px] transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-100/40 blur-[80px] transition-transform duration-1000 group-hover:translate-x-10" />

      <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
        {/* Eyebrow Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-fit items-center gap-2.5 rounded-full border border-slate-200/60 bg-white/60 backdrop-blur-md px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-slate-600 shadow-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          DASHBOARD OVERVIEW
        </motion.div>

        {/* Hero Title */}
        <div className="mt-1">
          <SplitText
            text="Practice Real AI Interviews"
            className="text-4xl md:text-[54px] font-bold tracking-tight text-slate-900 leading-[1.15]"
            delay={40}
            duration={1.2}
            ease="power4.out"
            splitType="words"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="left"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>

        {/* Subtitle / Gradient Text */}
        <motion.div
           initial={{ opacity: 0, filter: "blur(4px)" }}
           animate={{ opacity: 1, filter: "blur(0px)" }}
           transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
           className="mt-1"
        >
          <GradientText
            colors={["#64748b", "#3b82f6", "#8b5cf6", "#64748b"]}
            animationSpeed={5}
            showBorder={false}
            className="block !mx-0 !justify-start text-[17px] md:text-lg font-medium tracking-wide"
          >
            Start Your AI Mock-up Interview
          </GradientText>
        </motion.div>
      </div>

      {/* Hero Icon Graphic */}
      <motion.div 
         initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
         animate={{ opacity: 1, scale: 1, rotate: 0 }}
         transition={{ duration: 0.9, delay: 0.3, ease: "backOut" }}
         className="relative hidden xl:flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-tr from-white to-slate-50 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 z-10 shrink-0"
      >
          {/* Orbit rings */}
          <div className="absolute inset-[-15px] rounded-full border border-blue-100/50 [border-style:dashed] animate-[spin_15s_linear_infinite]"></div>
          <div className="absolute inset-[-30px] rounded-full border border-purple-100/30 animate-[spin_25s_linear_infinite_reverse]"></div>
          
          {/* Inner spark element */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-blue-500 drop-shadow-md">
               <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
            </svg>
          </div>
      </motion.div>
    </div>
  );
}