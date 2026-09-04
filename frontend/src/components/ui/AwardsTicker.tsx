"use client";

import React from "react";
import Link from "next/link";
import { CERTIFICATIONS_DATA } from "@/config/site";
import { Award, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { soundManager } from "@/lib/audio";

export const AwardsTicker: React.FC = () => {
  return (
    <section id="certifications" className="relative py-32 px-6 md:px-16 md:pl-28 max-w-7xl mx-auto border-t border-[#1a1c22]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#23262c]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
            <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
              VERIFIED CREDENTIALS // ACADEMIC RIGOR
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Certifications &amp; Honors
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link
            href="/certifications"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-2 text-xs font-mono text-[#ff5a1f] hover:underline uppercase tracking-wider"
          >
            <span>View Full Timeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Industrial Certifications Table */}
      <div className="divide-y divide-[#202227] border-y border-[#202227]">
        {CERTIFICATIONS_DATA.map((cert) => (
          <div
            key={cert.id}
            onMouseEnter={() => soundManager.playHover()}
            className="group py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#14161a] px-4 -mx-4 rounded-lg transition-colors cursor-default"
          >
            <div className="flex items-baseline gap-6 sm:gap-10">
              <span className="font-mono text-xs text-[#5f6574] w-24">
                {cert.issuer}
              </span>
              <div>
                <span className="font-heading font-semibold text-lg sm:text-xl text-white group-hover:text-[#ff5a1f] transition-colors">
                  {cert.title}
                </span>
                <p className="text-xs text-[#7e8594] font-sans mt-0.5 max-w-xl">
                  {cert.highlight}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 flex-shrink-0">
              <span className="font-mono text-[11px] text-[#878e9c] px-2.5 py-1 rounded bg-[#17191e] border border-[#23262c]">
                {cert.category}
              </span>

              <span className="flex items-center gap-1.5 font-mono text-xs text-[#00ff88]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
