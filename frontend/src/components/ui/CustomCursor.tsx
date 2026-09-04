"use client";

import React, { useEffect, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disable custom cursor on touch/coarse pointer devices (phones/tablets)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovered = false;
    let isClicking = false;
    let isVisible = false;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (ringRef.current) ringRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("[data-cursor='pointer']"))
      ) {
        isHovered = true;
      } else {
        isHovered = false;
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
    };

    const handleMouseUp = () => {
      isClicking = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    // Smooth 60fps RAF loop without triggering ANY React re-renders
    const renderLoop = () => {
      if (isVisible) {
        // Fast lerp interpolation for trailing ring
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;

        const scale = isClicking ? 0.75 : isHovered ? 1.7 : 1;
        const ringBg = isHovered ? "rgba(255, 90, 31, 0.15)" : "transparent";

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
          ringRef.current.style.backgroundColor = ringBg;
        }

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer follow ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-[#ff5a1f] opacity-0 transition-opacity duration-200 pointer-events-none will-change-transform"
        style={{
          width: "32px",
          height: "32px",
          transform: "translate3d(-100px, -100px, 0)",
        }}
      />
      {/* Center pinpoint dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#ff5a1f] opacity-0 transition-opacity duration-200 pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      />
    </div>
  );
};
