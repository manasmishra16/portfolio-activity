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
    <main className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#090a0d] text-[#ededed] select-none">
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
      <section className="relative w-full h-full overflow-hidden bg-[#090a0d]">
        {/* Subtle Background Atmosphere: Deep Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-[#12151d]/30 via-[#090a0d]/70 to-[#090a0d] pointer-events-none" />

        {/* 3D React Three Fiber WebGL Canvas Wrapped in Error Boundary */}
        <div className="absolute inset-0 z-10">
          <CanvasErrorBoundary>
            <HeroCanvas interactiveControls={true} />
          </CanvasErrorBoundary>
        </div>

        {/* Clean 2-Column Hero Typography Overlay */}
        <HeroOverlay />
      </section>
    </main>
  );
}
