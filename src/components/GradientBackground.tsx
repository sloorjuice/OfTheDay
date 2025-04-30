// components/GradientBackground.tsx
import React from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const GradientBackground = ({ children, className = "" }: Props) => {
  return (
    <div className={`bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default GradientBackground;
