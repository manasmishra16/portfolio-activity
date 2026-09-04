import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { SITE_CONFIG } from "@/config/site";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience & Education — Manas Mishra",
  description: "Academic timeline at KSIT Bengaluru, coursework, and software developer journey of Manas Mishra.",
};

export default function ExperiencePage() {
  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            CHRONOLOGY &amp; ACADEMIC TIMELINE
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-8">
          Education &amp; Experience
        </h1>

        {/* Timeline */}
        <div className="relative border-l border-[#24272f] ml-3 sm:ml-4 pl-6 sm:pl-10 space-y-14 my-12">
          {/* Milestone 1: Undergraduate Degree */}
          <div className="relative">
            <span className="absolute -left-[33px] sm:-left-[49px] top-1.5 w-4 h-4 rounded-full bg-[#ff5a1f] border-4 border-[#0c0d0e]" />

            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-xs text-[#ff5a1f] px-2.5 py-1 rounded bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 font-semibold uppercase">
                2023 — 2027 (CURRENT)
              </span>
              <span className="font-mono text-xs text-[#9199ab]">
                UNDERGRADUATE STUDIES
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
              Bachelor of Engineering in Computer Science &amp; Engineering
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-[#9199ab] mb-4">
              <span className="text-white font-medium">{SITE_CONFIG.education.institution}</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff5a1f]" /> {SITE_CONFIG.education.location}
              </span>
              <span className="text-[#00ff88] font-semibold">CGPA: 7.72 / 10</span>
            </div>

            <p className="text-sm sm:text-base text-[#b4bccb] leading-relaxed font-sans mb-4">
              Engaged in rigorous foundational and applied computer science curricula. Specializing in machine learning,
              data structures &amp; algorithms, database systems, and Unix operating system architectures.
            </p>

            <div className="p-5 rounded-xl border border-[#22252e] bg-[#121418] shadow-md">
              <span className="font-mono text-xs text-[#b0b8c8] uppercase font-semibold block mb-2.5">
                Curricular Competencies &amp; Labs:
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-xs text-[#9aa2b4]">
                <span className="px-3 py-1 rounded bg-[#16181e] border border-[#232630]">Design &amp; Analysis of Algorithms</span>
                <span className="px-3 py-1 rounded bg-[#16181e] border border-[#232630]">Object-Oriented Programming with Java</span>
                <span className="px-3 py-1 rounded bg-[#16181e] border border-[#232630]">Database Management Systems (SQL)</span>
                <span className="px-3 py-1 rounded bg-[#16181e] border border-[#232630]">Operating Systems &amp; System Programming</span>
                <span className="px-3 py-1 rounded bg-[#16181e] border border-[#232630]">Computer Networks &amp; Distributed Protocols</span>
              </div>
            </div>
          </div>

          {/* Milestone 2: Independent ML & Full-Stack Development */}
          <div className="relative">
            <span className="absolute -left-[33px] sm:-left-[49px] top-1.5 w-4 h-4 rounded-full bg-[#ff5a1f]/40 border-4 border-[#0c0d0e]" />

            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-xs text-[#9aa2b5] px-2.5 py-1 rounded bg-[#16181e] border border-[#262933] font-semibold uppercase">
                2024 — PRESENT
              </span>
              <span className="font-mono text-xs text-[#9199ab]">
                OPEN SOURCE &amp; SYSTEM ENGINEERING
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
              Machine Learning &amp; Full-Stack Systems Developer
            </h2>

            <div className="text-sm font-mono text-[#9199ab] mb-4">
              Autonomous Technical Projects // GitHub (@manasmishra16)
            </div>

            <ul className="space-y-3.5 text-sm sm:text-base text-[#b4bccb] font-sans">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] mt-2.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Engineered a hybrid CNN-LSTM deep learning model for clinical cardiovascular risk detection in TensorFlow, integrating a stateless Flask REST prediction server.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] mt-2.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Developed MangoML, an end-to-end automated machine learning pipeline with automated feature engineering, ensemble benchmarks, and responsive TypeScript web client.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] mt-2.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Architected a complete PG and Hostel allocation platform using React and Supabase, writing PLpgSQL stored procedures to enforce ACID transactional room assignment constraints.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] mt-2.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Constructed 60 FPS zero-gravity Three.js WebGL canvas workstations featuring procedural bump shaders and custom Web Audio API acoustic synthesis.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[#22252c]">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition-all active:scale-[0.98]"
          >
            <span>Review Skills Matrix</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272b34] bg-[#131519] hover:border-white text-white text-sm font-mono transition-colors active:scale-[0.98]"
          >
            <span>Download Resume</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
