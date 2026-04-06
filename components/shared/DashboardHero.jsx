"use client";

import SplitText from "@/components/animations/SplitText";
import GradientText from "@/components/animations/GradientText";

export default function DashboardHero() {

  const handleAnimationComplete = () => {};

  return (
    <div>
      <SplitText
        text="Practice Real AI Interviews"
        className="text-2xl md:text-6xl font-bold text-white"
        delay={50}
        duration={1.25}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="left"
        onLetterAnimationComplete={handleAnimationComplete}
        showCallback
      />
        <div className="mt-2">
            <GradientText
        colors={["#ffffffff", "#ffffffff", "#ffffffff"]}
        animationSpeed={8}
        showBorder={false}
        className="block !mx-0 !justify-start"
      >
        Start Your AI Mock-up Interview
      </GradientText>
        </div>
      
    </div>
  );
}