"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileCode2,
  Code2,
  GraduationCap,
  Calendar,
  GitBranch,
} from "lucide-react";

const STATS = [
  { icon: FileCode2, value: "02+", label: "ML MODELS" },
  { icon: Code2, value: "05+", label: "CORE TECH" },
  { icon: GraduationCap, value: "7.72", label: "CGPA (KSIT)" },
  { icon: Calendar, value: "2027", label: "GRADUATION" },
  { icon: GitBranch, value: "50+", label: "COMMITS" },
];

export const HeroOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none relative lg:absolute inset-0 z-20 flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-8 md:px-14 lg:px-20 md:pl-24 max-w-[1680px] mx-auto w-full">
      {/* UPPER / MAIN SECTION: 2-COLUMN GRID */}
      <div className="flex-1 flex items-start pt-2 sm:pt-6 lg:pt-0 lg:items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* LEFT 45%: EDITORIAL TYPOGRAPHY & ACTIONS */}
          <div className="lg:col-span-6 xl:col-span-5 pointer-events-auto flex flex-col justify-center max-w-[520px]">
            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_10px_rgba(255,90,31,0.9)] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs text-[#9aa2b5] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold">
                KSIT BENGALURU &apos;27 // DATA &amp; SYSTEMS
              </span>
            </div>

            {/* 2. Primary Display Title with clamp: prominent, non-colliding, fits 320px–414px */}
            <h1 className="font-heading font-extrabold text-[clamp(28px,7.8vw,58px)] text-white tracking-[-0.035em] leading-[1.0] mb-4 sm:mb-5 select-none">
              <div className="flex items-center gap-2 sm:gap-3">
                <span>DATA</span>
                <span className="text-[#ff5a1f] font-normal">→</span>
              </div>
              <div>INTELLIGENCE</div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[#ff5a1f] font-normal">→</span>
                <span>APPLICATION</span>
              </div>
            </h1>

            {/* 3. Balanced Subtitle */}
            <p className="text-xs sm:text-base text-[#a3abbd] font-sans leading-relaxed mb-6 sm:mb-8 max-w-[95%] sm:max-w-[460px]">
              Computer Science Engineer building predictive deep learning models, automated data pipelines, and responsive, interactive digital applications.
            </p>

            {/* 4. Action Buttons (Clean gap and stack on ultra-compact 320px width) */}
            <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-0">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase shadow-[0_0_30px_rgba(255,90,31,0.45)] hover:shadow-[0_0_40px_rgba(255,90,31,0.65)] transition-all duration-300 active:scale-[0.98]"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full border border-[#2c3240] bg-[#12151c]/90 hover:border-white text-xs sm:text-sm font-mono font-semibold text-[#d0d7e5] hover:text-white tracking-wider uppercase backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
              >
                <span>ABOUT PROFILE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
              </Link>
            </div>
          </div>

          {/* RIGHT 55%: PURE 3D WORKSTATION VIEWPORT ON DESKTOP */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full pointer-events-none" />
        </div>
      </div>

      {/* LOWER SECTION: FLOATING GLASS STATS BAR + SCROLL DOWN (Desktop docked, mobile streamlined) */}
      <div className="hidden lg:flex pointer-events-auto items-end justify-between w-full pt-4 mt-auto max-w-full overflow-hidden">
        {/* Floating Glass Stats Pill Container */}
        <div className="w-full sm:w-auto max-w-full overflow-x-auto scrollbar-none py-1">
          <div className="inline-flex items-center divide-x divide-white/10 rounded-2xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl px-7 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-w-max">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 first:pl-1 last:pr-1"
              >
                <stat.icon className="w-4 h-4 text-[#8a92a3] shrink-0" />
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg text-[#ff5a1f] leading-tight tracking-tight">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[9px] text-[#767e91] tracking-widest uppercase leading-tight font-semibold">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL DOWN Indicator */}
        <div className="flex flex-col items-center gap-2 pr-8">
          <span className="font-mono text-[9px] text-[#71798a] tracking-[0.25em] uppercase leading-tight text-center font-medium">
            SCROLL
            <br />
            EXPLORE
          </span>
          <div className="w-8 h-8 rounded-full border border-[#2c3240] flex items-end justify-center pb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_rgba(255,90,31,0.9)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

