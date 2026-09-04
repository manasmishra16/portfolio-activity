"use client";

import React from "react";
import { Html, useProgress } from "@react-three/drei";

export const CanvasLoader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-[#0c0d0e]/90 border border-[#26292e] rounded-xl backdrop-blur-md min-w-[240px]">
        <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
          {/* Pulsing neon orange ring */}
          <div className="absolute inset-0 rounded-full border border-[#ff5a1f]/30 animate-ping" />
          <div className="w-8 h-8 rounded-full border-2 border-t-[#ff5a1f] border-r-[#ff5a1f] border-b-transparent border-l-transparent animate-spin" />
          <div className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
        </div>
        <p className="font-mono text-xs text-[#878e9c] tracking-[0.25em] uppercase mb-2">
          INITIALIZING ZERO-G
        </p>
        <div className="w-36 h-1 bg-[#1a1c20] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff5a1f] to-[#ff7700] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(15, progress))}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-[#5a5f6b] mt-1.5">
          {Math.round(progress)}% SHADER COMPILATION
        </span>
      </div>
    </Html>
  );
};
