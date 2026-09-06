"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { VerticalRail } from "@/components/ui/VerticalRail";
import { MenuDrawer } from "@/components/ui/MenuDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SiteFooter } from "@/components/ui/SiteFooter";

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0c0d0e] text-[#ededed] overflow-x-hidden selection:bg-[#ff5a1f] selection:text-white">
      <CustomCursor />
      <VerticalRail />

      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        isMenuOpen={isMenuOpen}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <main className="relative z-10 pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 md:px-16 md:pl-28 max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
};
