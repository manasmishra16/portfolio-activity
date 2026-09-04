"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";
import { SITE_CONFIG } from "@/config/site";

export const SiteFooter: React.FC = () => {
  const scrollToTop = () => {
    soundManager.playClick();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-[#1a1c22] bg-[#090a0d] py-12 px-6 sm:px-12 md:px-16 lg:px-20 md:pl-28">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Positioning */}
        <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-lg text-white uppercase tracking-tight">
              MANAS MISHRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
          </div>
          <p className="font-mono text-xs text-[#6e7482]">
            DATA → INTELLIGENCE → APPLICATION // KSIT &apos;27
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 text-xs font-mono text-[#8a909f]">
          <a
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <GitHubIcon className="w-4 h-4 text-[#ff5a1f]" />
            <span>GitHub</span>
          </a>

          <a
            href={SITE_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <LinkedInIcon className="w-4 h-4 text-[#ff5a1f]" />
            <span>LinkedIn</span>
          </a>

          <Link
            href="/contact"
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-1 text-[#ff5a1f] hover:underline"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundManager.playHover()}
          className="flex items-center gap-2 font-mono text-xs text-[#727887] hover:text-white transition-colors cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#ff5a1f]" />
        </button>
      </div>
    </footer>
  );
};
