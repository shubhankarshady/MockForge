"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function GsapMagnetic({ children, strength = 0.4 }) {
  const containerRef = useRef(null);
  const visualRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const visual = visualRef.current;
    if (!container || !visual) return;

    // quickTo exclusively manipulates the inner visual element
    const xTo = gsap.quickTo(visual, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(visual, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    container.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      
      // Bounding calculation strictly off the static, un-transformed wrapper
      const { height, width, left, top } = container.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * strength);
      yTo(y * strength);
    });

    container.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  }, { scope: containerRef }); // ensure clean React lifecycle

  return (
    // Outer Hit-Box padding stretches detection seamlessly beyond the visual button
    <div 
      ref={containerRef} 
      className="inline-flex relative z-10 p-4 -m-4 sm:p-8 sm:-m-8 cursor-pointer items-center justify-center"
    >
      {/* Inner visual block that flies around, leaving structural DOM flawlessly intact */}
      <div 
        ref={visualRef} 
        className="inline-flex will-change-transform pointer-events-auto"
      >
        {children}
      </div>
    </div>
  );
}
