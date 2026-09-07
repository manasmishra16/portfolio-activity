"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, FileText, Sun, Moon } from "lucide-react";
import { soundManager } from "@/lib/audio";
import { useTheme } from "@/lib/theme-context";
import { PrivateAccessModal } from "@/components/ui/PrivateAccessModal";

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
  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme !== "light";

  // Hidden owner-only trigger state (Desktop: 5 clicks / 1.5s, Mobile: long press 1.5s)
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pointerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const longPressTriggeredRef = useRef(false);

  const triggerPrivateAccess = useCallback(() => {
    setIsPrivateModalOpen(true);
  }, []);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    // Only track touch interactions for mobile long-press
    if (e.pointerType !== "touch") return;

    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    longPressTriggeredRef.current = false;
    clearLongPressTimer();

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch {}
      }
      triggerPrivateAccess();
    }, 1500);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!longPressTimerRef.current || e.pointerType !== "touch") return;
    const deltaX = Math.abs(e.clientX - pointerStartPosRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartPosRef.current.y);

    // Cancel if movement exceeds ~10px in any direction (scrolling or dragging)
    if (deltaX > 10 || deltaY > 10) {
      clearLongPressTimer();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "touch") {
      clearLongPressTimer();
    }
  };

  const handlePointerCancel = () => {
    clearLongPressTimer();
  };

  // Cancel long-press if page visibility changes (e.g., tab switch, screen off)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearLongPressTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If a long press was triggered on mobile, cancel normal navigation
    if (longPressTriggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggeredRef.current = false;
      return;
    }

    // Desktop: 5 rapid clicks within 1.5s
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    if (clickCountRef.current >= 5) {
      e.preventDefault();
      e.stopPropagation();
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      triggerPrivateAccess();
      return;
    }

    // If navigating home from admin area on normal single click, invalidate session
    if (pathname?.startsWith("/admin")) {
      fetch("/api/admin/logout", { method: "POST", keepalive: true }).catch(() => {});
    }
  };

  const handleNavClick = () => {
    if (pathname?.startsWith("/admin")) {
      fetch("/api/admin/logout", { method: "POST", keepalive: true }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isDark
          ? isScrolled
            ? "bg-[#090a0c]/95 backdrop-blur-md border-b border-[#1c1f26] py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            : "bg-[#0c0d0e]/90 backdrop-blur-sm border-b border-[#181a20] py-3.5"
          : isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] py-3 shadow-xs"
          : "bg-[#f8fafc]/90 backdrop-blur-sm border-b border-[#e5e7eb] py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 md:pl-28 w-full flex items-center justify-between">
        {/* BRAND MARK: MANAS / MISHRA ● */}
        <Link
          href="/"
          onClick={handleLogoClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onContextMenu={(e) => {
            // Prevent Android Chrome's native link context menu specifically for this trigger
            e.preventDefault();
          }}
          style={{ WebkitTouchCallout: "none" }}
          className="group flex items-center gap-2 select-none shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5a1f] rounded"
          aria-label="Manas Mishra Home"
        >
          <div
            className={`font-heading font-black text-xs sm:text-[13px] leading-[1.08] uppercase tracking-wider transition-colors ${
              isDark ? "text-white group-hover:text-[#ff5a1f]" : "text-[#0f172a] group-hover:text-[#ff5a1f]"
            }`}
          >
            <div>MANAS</div>
            <div>MISHRA</div>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] shadow-[0_0_6px_rgba(255,90,31,0.8)] shrink-0 self-center" />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav
          className={`hidden lg:flex items-center gap-6 xl:gap-8 font-mono text-[11px] tracking-widest transition-colors ${
            isDark ? "text-[#828a99]" : "text-[#64748b]"
          }`}
          aria-label="Primary Navigation"
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
                onClick={handleNavClick}
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
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#ff5a1f] rounded-full shadow-[0_0_8px_rgba(255,90,31,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTION: RESUME PILL + THEME TOGGLE */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/resume"
            onClick={handleNavClick}
            className={`inline-flex items-center gap-2 h-9 px-4 rounded-full border text-xs font-mono font-semibold tracking-wider transition-all duration-200 ${
              pathname === "/resume"
                ? "border-[#ff5a1f] bg-[#ff5a1f] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)]"
                : isDark
                ? "border-[#ff5a1f]/60 bg-[#ff5a1f]/10 text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-white"
                : "border-[#ff5a1f]/70 bg-[#ff5a1f]/10 text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-white"
            }`}
            aria-label="View Resume Dossier"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>RESUME</span>
          </Link>

          <button
            onClick={() => {
              soundManager.playClick();
              toggleTheme();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`w-11 h-6 rounded-full border transition-all flex items-center px-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5a1f] ${
              theme === "light"
                ? "bg-[#e2e8f0] border-[#cbd5e1] justify-end"
                : "bg-[#14161d] border-white/10 justify-start"
            }`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
            aria-label="Toggle Theme"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                theme === "light"
                  ? "bg-white text-[#ff5a1f] shadow-xs"
                  : "bg-[#1f2330] text-[#ff5a1f]"
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
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              toggleTheme();
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
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
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
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

      <PrivateAccessModal
        isOpen={isPrivateModalOpen}
        onClose={() => setIsPrivateModalOpen(false)}
      />
    </header>
  );
};
