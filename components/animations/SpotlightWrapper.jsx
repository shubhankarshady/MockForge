"use client";

import SpotlightCard from "./SpotlightCard";

export default function SpotlightWrapper({ children }) {
  return (
    <SpotlightCard
      className="custom-spotlight-card"
      spotlightColor="rgba(0, 229, 255, 0.2)"
    >
      {children}
    </SpotlightCard>
  );
}