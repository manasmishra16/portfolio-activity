"use client";

import React from "react";

const TECH_TOOLCHAIN = [
  "TENSORFLOW",
  "PYTHON",
  "SCIKIT-LEARN",
  "NEXT.JS (APP ROUTER)",
  "REACT 19",
  "THREE.JS / WEBGL",
  "FASTAPI",
  "POSTGRESQL",
  "SUPABASE",
  "PANDAS & NUMPY",
  "FLASK",
  "JAVA (OOPS)",
  "R PROGRAMMING",
  "TAILWIND CSS",
  "LINUX OS",
];

export const ClientMarquee: React.FC = () => {
  return (
    <section className="relative py-12 overflow-hidden border-y border-[#23262c] bg-[#0f1013]">
      <div className="flex select-none">
        {/* Continuous ticker track */}
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {TECH_TOOLCHAIN.concat(TECH_TOOLCHAIN).map((item, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="font-heading font-bold text-lg sm:text-xl text-[#4a4f5b] hover:text-[#ff5a1f] transition-colors tracking-wider uppercase cursor-default">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f] opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
