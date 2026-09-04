"use client";

import React from "react";
import Link from "next/link";
import { X, ArrowUpRight, Mail, FileText } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";
import { SITE_CONFIG } from "@/config/site";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (targetId: string) => void;
  onOpenContact?: () => void;
}

const MENU_ITEMS = [
  { num: "01", label: "Home", href: "/" },
  { num: "02", label: "About Manas", href: "/about" },
  { num: "03", label: "Projects & Architecture", href: "/projects" },
  { num: "04", label: "Education & Experience", href: "/experience" },
  { num: "05", label: "Skills Matrix", href: "/skills" },
  { num: "06", label: "Certifications", href: "/certifications" },
  { num: "07", label: "Achievements", href: "/achievements" },
  { num: "08", label: "Engineering Notes", href: "/notes" },
  { num: "09", label: "Resume (PDF)", href: "/resume" },
];

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0c0d0e]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-14 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#23262c] pb-6">
        <div className="flex items-baseline gap-1">
          <span className="font-heading font-extrabold text-2xl text-white uppercase">
            MANAS MISHRA
          </span>
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          onMouseEnter={() => soundManager.playHover()}
          className="w-10 h-10 rounded-full border border-[#2d3038] bg-[#14161a] flex items-center justify-center text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {MENU_ITEMS.map((item) => (
            <div key={item.num}>
              <Link
                href={item.href}
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="group flex items-baseline gap-4 text-left cursor-pointer py-1.5"
              >
                <span className="font-mono text-xs sm:text-sm text-[#ff5a1f] font-bold">
                  {item.num}
                </span>
                <span className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#ff5a1f] transition-colors">
                  {item.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#4a4f5b] group-hover:text-[#ff5a1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </Link>
            </div>
          ))}

          <div>
            <Link
              href="/contact"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              onMouseEnter={() => soundManager.playHover()}
              className="group flex items-baseline gap-4 text-left cursor-pointer py-1.5"
            >
              <span className="font-mono text-xs sm:text-sm text-[#ff5a1f] font-bold">
                10
              </span>
              <span className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#ff5a1f] group-hover:text-white transition-colors">
                Get in Touch
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#23262c] text-xs font-mono text-[#787e8d]">
        <div>
          <span className="text-[#a5abb8] uppercase font-semibold block mb-1">
            INSTITUTE &amp; LOCATION
          </span>
          <p>{SITE_CONFIG.education.institution}</p>
          <p className="text-[#555a64]">{SITE_CONFIG.education.location}</p>
        </div>

        <div>
          <span className="text-[#a5abb8] uppercase font-semibold block mb-1">
            DIRECT CONTACT
          </span>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-white hover:text-[#ff5a1f] transition-colors block"
          >
            {SITE_CONFIG.email}
          </a>
          <p className="text-[#555a64]">Expected Graduation: 2027</p>
        </div>

        <div>
          <span className="text-[#a5abb8] uppercase font-semibold block mb-1">
            NETWORK PROFILES
          </span>
          <div className="flex gap-4">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
