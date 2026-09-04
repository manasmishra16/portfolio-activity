"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, FileText, Sun, Moon } from "lucide-react";
import { soundManager } from "@/lib/audio";
import { useTheme } from "@/lib/theme-context";

interface NavbarProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "SKILLS", href: "/skills" },
  { label: "CERTS", href: "/certifications" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "CONTACT", href: "/contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenu }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme !== "light";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? "bg-[#08090b]/90 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] py-3 shadow-sm"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-10 md:px-14 lg:px-20 md:pl-24 flex items-center justify-between">
        {/* BRAND MARK: MANAS / MISHRA ● */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 select-none shrink-0"
        >
          <div
            className={`font-heading font-black text-sm sm:text-base leading-[1.05] uppercase tracking-tight transition-colors ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            <div>MANAS</div>
            <div>MISHRA</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] shadow-[0_0_10px_rgba(255,90,31,0.9)] mt-auto mb-0.5 ml-0.5" />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav
          className={`hidden lg:flex items-center gap-8 font-mono text-[11px] tracking-widest transition-colors ${
            isDark ? "text-[#788090]" : "text-[#64748b]"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? isDark
                      ? "text-white font-bold"
                      : "text-[#0f172a] font-bold"
                    : isDark
                    ? "hover:text-white"
                    : "hover:text-[#0f172a]"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff5a1f]" />
                )}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#ff5a1f] rounded-full shadow-[0_0_8px_rgba(255,90,31,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTION: RESUME PILL + THEME TOGGLE */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ff5a1f]/80 bg-[#ff5a1f]/10 hover:bg-[#ff5a1f] text-[#ff5a1f] hover:text-white text-xs font-mono font-semibold tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(255,90,31,0.2)] hover:shadow-[0_0_25px_rgba(255,90,31,0.5)]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RESUME</span>
          </Link>

          <button
            onClick={() => {
              soundManager.playClick();
              toggleTheme();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`w-12 h-7 rounded-full border transition-all flex items-center px-1 cursor-pointer ${
              theme === "light"
                ? "bg-[#e2e8f0] border-[#cbd5e1] justify-end"
                : "bg-[#12151d] border-white/10 justify-start"
            }`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
            aria-label="Toggle Theme"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                theme === "light"
                  ? "bg-white text-[#ff5a1f] shadow-sm"
                  : "bg-[#1b1f2b] text-[#ff5a1f]"
              }`}
            >
              {theme === "light" ? (
                <Moon className="w-3 h-3" />
              ) : (
                <Sun className="w-3 h-3" />
              )}
            </div>
          </button>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              toggleTheme();
            }}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? "border-[#202329] bg-[#111317] text-[#ff5a1f]"
                : "border-[#e2e8f0] bg-white text-[#ff5a1f]"
            }`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenMenu}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? "border-[#202329] bg-[#111317] text-white hover:border-[#ff5a1f]"
                : "border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#ff5a1f]"
            }`}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
