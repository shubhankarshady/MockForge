"use client";
import React from 'react';
import { motion } from 'motion/react';

export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#000000]">
      
      {/* Deep film grain/noise for ultra-premium texture avoiding the "flat/simple" look */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Massive rotating conic sweep for dramatic, cinematic fluid lighting changes */}
      <motion.div 
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} 
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] origin-center opacity-[0.45] mix-blend-screen"
        style={{
          background: 'conic-gradient(from 90deg at 50% 50%, #000000 0%, #1e293b 15%, #000000 30%, #334155 45%, #000000 60%, #1e293b 75%, #000000 90%, #000000 100%)',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Core structural ambient light reflecting off the "glass" features */}
      <motion.div 
        animate={{ x: ["-10%", "10%", "-10%"], y: ["-5%", "10%", "-5%"], scale: [0.8, 1.1, 0.8] }} 
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[20%] w-[60%] h-[70%] rounded-full bg-slate-300/10 blur-[130px] mix-blend-screen"
      />

      {/* Fast, highly engaging intersecting light beams reflecting a "high-tech" scifi pulse */}
      <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
        <motion.div 
          animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/4 left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent -rotate-45"
        />
        <motion.div 
          animate={{ x: ["200%", "-100%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-1/3 right-0 w-[300%] h-[2px] bg-gradient-to-r from-transparent via-slate-300/20 to-transparent rotate-12"
        />
        <motion.div 
          animate={{ y: ["-100%", "200%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
          className="absolute top-0 right-1/4 w-[1px] h-[300%] bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45"
        />
        
        {/* Symmetrical line shooting down the left side mirroring the right side (-rotate-45) */}
        <motion.div 
          animate={{ y: ["-100%", "200%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-0 left-[15%] w-[1px] h-[300%] bg-gradient-to-b from-transparent via-white/30 to-transparent -rotate-45"
        />
      </div>

       {/* Deep horizon fade that grounds the layout text gracefully back to pure black */}
       <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#000000] via-[#050505]/80 to-transparent z-30" />
    </div>
  );
}
