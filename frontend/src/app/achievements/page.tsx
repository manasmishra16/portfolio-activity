import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { ACHIEVEMENTS_DATA } from "@/config/site";
import { Award, Cloud, GraduationCap, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements & Milestones — Manas Mishra",
  description: "Verified achievements including Google Cloud Arcade badges, academic standing at KSIT, and open source development.",
};

export default function AchievementsPage() {
  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
            RECOGNITION &amp; TECHNICAL MILESTONES
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[1.08] mb-4">
          Achievements
        </h1>
        <p className="text-base text-[#8e94a0] max-w-2xl font-sans leading-relaxed mb-12">
          Documented technical milestones, cloud computing completions, and consistent academic merit.
        </p>

        {/* Achievements Grid */}
        <div className="space-y-6 mb-16">
          {ACHIEVEMENTS_DATA.map((ach) => (
            <div
              key={ach.id}
              className="p-6 sm:p-8 rounded-2xl border border-[#23262c] bg-[#121417] hover:border-[#ff5a1f]/50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6"
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-[#ff5a1f] px-2.5 py-1 rounded bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 font-semibold uppercase">
                    {ach.badgeType}
                  </span>
                  <span className="font-mono text-xs text-[#717785]">
                    {ach.year}
                  </span>
                </div>

                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
                  {ach.title}
                </h2>

                <div className="font-mono text-xs text-[#8a909d] mb-4">
                  Organization: <span className="text-white font-medium">{ach.organization}</span>
                </div>

                <p className="text-sm text-[#b0b6c4] font-sans leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full border border-[#2d3038] bg-[#17191e] flex items-center justify-center text-[#ff5a1f] flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#23262c]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition-all"
          >
            <span>Explore Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272a31] bg-[#14161a] hover:border-white text-white text-sm font-mono transition-colors"
          >
            <span>View Certifications</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
