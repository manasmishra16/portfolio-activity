"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/Navbar";
import { VerticalRail } from "@/components/ui/VerticalRail";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { MenuDrawer } from "@/components/ui/MenuDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";

// Dynamically import the Hero 3D WebGL Canvas to ensure client-only execution & route-level isolation
const HeroCanvas = dynamic(
  () =>
    import("@/components/canvas/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#08090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-[#ff5a1f] border-r-[#ff5a1f] border-b-transparent border-l-transparent animate-spin" />
          <span className="font-mono text-xs text-[#6e7481] tracking-widest uppercase">
            CALIBRATING WORKSTATION...
          </span>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <main className="relative w-screen min-h-screen lg:h-screen lg:h-[100dvh] overflow-x-hidden lg:overflow-hidden bg-[#090a0d] text-[#ededed] select-none">
      {/* Custom Interactive Follow Cursor */}
      <CustomCursor />

      {/* Fixed Left Vertical Rail ("MANAS MISHRA // PORTFOLIO 2026") */}
      <VerticalRail />

      {/* Ultra-Minimalist Top Navigation */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        isMenuOpen={isMenuOpen}
      />

      {/* Fullscreen Mobile / Accessibility Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* DEDICATED HERO SECTION WITH 3D WORKSTATION */}
      <section className="relative w-full min-h-screen lg:h-full overflow-x-hidden bg-[#090a0d] flex flex-col justify-between">
        {/* Subtle Background Atmosphere: Deep Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-[#12151d]/30 via-[#090a0d]/70 to-[#090a0d] pointer-events-none" />

        {/* 3D React Three Fiber WebGL Canvas Wrapped in Error Boundary */}
        {/* On mobile (<lg): Sits in a dedicated viewport below the CTA buttons */}
        {/* On desktop (lg+): Absolute inset-0 covering the right 55% seamlessly as originally designed */}
        <div className="order-2 lg:order-none relative lg:absolute inset-x-0 bottom-0 h-[340px] xs:h-[380px] sm:h-[440px] lg:inset-0 lg:h-full z-10 pointer-events-auto">
          <CanvasErrorBoundary>
            <HeroCanvas interactiveControls={true} />
          </CanvasErrorBoundary>
        </div>

        {/* Clean 2-Column Hero Typography Overlay (pointer-events-none on desktop so 3D mouse parallax responds smoothly) */}
        <div className="order-1 lg:order-none z-20 w-full flex-1 flex flex-col justify-between pointer-events-none">
          <HeroOverlay />
        </div>

        {/* Mobile-Only Bottom Stats Capsule: Cleanly docked at the very bottom under the laptop reveal */}
        <div className="order-3 lg:hidden z-20 w-full px-4 pb-6 pt-2 pointer-events-auto flex justify-center">
          <div className="w-full max-w-full overflow-x-auto scrollbar-none py-1 flex justify-center">
            <div className="inline-flex items-center divide-x divide-white/10 rounded-xl border border-white/10 bg-[#0d1017]/90 backdrop-blur-xl px-3 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] min-w-max">
              <div className="flex items-center gap-2 px-2.5 first:pl-1">
                <span className="font-heading font-extrabold text-xs text-[#ff5a1f]">02+</span>
                <span className="font-mono text-[8px] text-[#8c94a5] tracking-wider uppercase font-semibold">ML MODELS</span>
              </div>
              <div className="flex items-center gap-2 px-2.5">
                <span className="font-heading font-extrabold text-xs text-[#ff5a1f]">05+</span>
                <span className="font-mono text-[8px] text-[#8c94a5] tracking-wider uppercase font-semibold">CORE TECH</span>
              </div>
              <div className="flex items-center gap-2 px-2.5">
                <span className="font-heading font-extrabold text-xs text-[#ff5a1f]">7.72</span>
                <span className="font-mono text-[8px] text-[#8c94a5] tracking-wider uppercase font-semibold">CGPA</span>
              </div>
              <div className="flex items-center gap-2 px-2.5">
                <span className="font-heading font-extrabold text-xs text-[#ff5a1f]">2027</span>
                <span className="font-mono text-[8px] text-[#8c94a5] tracking-wider uppercase font-semibold">GRAD</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 last:pr-1">
                <span className="font-heading font-extrabold text-xs text-[#ff5a1f]">50+</span>
                <span className="font-mono text-[8px] text-[#8c94a5] tracking-wider uppercase font-semibold">COMMITS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
