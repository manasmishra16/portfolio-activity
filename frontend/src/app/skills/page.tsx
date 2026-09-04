import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { SKILLS_CONFIG } from "@/config/site";
import { Code2, Database, Layout, Server, Terminal, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills Matrix & Toolchain — Manas Mishra",
  description: "Verified programming, machine learning, web, database, and backend skills of Manas Mishra.",
};

export default function SkillsPage() {
  return (
    <PageShell>
      <div className="max-w-5xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            TECHNICAL REPERTOIRE // VERIFIED COMPETENCIES
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-4">
          Skills &amp; Toolchain
        </h1>
        <p className="text-base sm:text-lg text-[#a2aab9] max-w-3xl font-sans leading-relaxed mb-12">
          A breakdown of languages, frameworks, mathematical toolchains, and operating systems
          utilized across machine learning modeling, data analytics, and full-stack software development.
        </p>

        {/* Category Sections */}
        <div className="space-y-10 mb-16">
          {/* Section 1: Programming */}
          <section className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[#22252e] bg-[#121418] shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-6 pb-4 border-b border-[#1f222a] font-semibold">
              <Code2 className="w-4 h-4" />
              <span>PROGRAMMING LANGUAGES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKILLS_CONFIG.programming.map((skill) => (
                <div key={skill.name} className="p-5 rounded-xl border border-[#1e2129] bg-[#0e1013] hover:border-[#323644] transition-colors">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{skill.name}</h3>
                    <span className="font-mono text-[10px] text-[#ff5a1f] uppercase px-2.5 py-0.5 rounded bg-[#ff5a1f]/10 font-semibold border border-[#ff5a1f]/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-[#9aa2b4] font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Data & Machine Learning */}
          <section className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[#22252e] bg-[#121418] shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-6 pb-4 border-b border-[#1f222a] font-semibold">
              <Database className="w-4 h-4" />
              <span>DATA SCIENCE &amp; MACHINE LEARNING</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKILLS_CONFIG.dataAndML.map((skill) => (
                <div key={skill.name} className="p-5 rounded-xl border border-[#1e2129] bg-[#0e1013] hover:border-[#323644] transition-colors">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{skill.name}</h3>
                    <span className="font-mono text-[10px] text-[#ff5a1f] uppercase px-2.5 py-0.5 rounded bg-[#ff5a1f]/10 font-semibold border border-[#ff5a1f]/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-[#9aa2b4] font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Web & Frontend */}
          <section className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[#22252e] bg-[#121418] shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-6 pb-4 border-b border-[#1f222a] font-semibold">
              <Layout className="w-4 h-4" />
              <span>WEB &amp; FRONTEND ARCHITECTURE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKILLS_CONFIG.webAndFrontend.map((skill) => (
                <div key={skill.name} className="p-5 rounded-xl border border-[#1e2129] bg-[#0e1013] hover:border-[#323644] transition-colors">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{skill.name}</h3>
                    <span className="font-mono text-[10px] text-[#ff5a1f] uppercase px-2.5 py-0.5 rounded bg-[#ff5a1f]/10 font-semibold border border-[#ff5a1f]/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-[#9aa2b4] font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Backend, Database & Cloud */}
          <section className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[#22252e] bg-[#121418] shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-6 pb-4 border-b border-[#1f222a] font-semibold">
              <Server className="w-4 h-4" />
              <span>BACKEND, APIS &amp; RELATIONAL STORAGE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKILLS_CONFIG.backendAndAPIs.concat(SKILLS_CONFIG.databaseAndCloud).map((skill) => (
                <div key={skill.name} className="p-5 rounded-xl border border-[#1e2129] bg-[#0e1013] hover:border-[#323644] transition-colors">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{skill.name}</h3>
                    <span className="font-mono text-[10px] text-[#ff5a1f] uppercase px-2.5 py-0.5 rounded bg-[#ff5a1f]/10 font-semibold border border-[#ff5a1f]/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-[#9aa2b4] font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Systems & Tools */}
          <section className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[#22252e] bg-[#121418] shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-6 pb-4 border-b border-[#1f222a] font-semibold">
              <Terminal className="w-4 h-4" />
              <span>SYSTEM TOOLS &amp; WORKFLOW</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SKILLS_CONFIG.toolsAndWorkflow.map((skill) => (
                <div key={skill.name} className="p-5 rounded-xl border border-[#1e2129] bg-[#0e1013] hover:border-[#323644] transition-colors">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{skill.name}</h3>
                    <span className="font-mono text-[10px] text-[#ff5a1f] uppercase px-2.5 py-0.5 rounded bg-[#ff5a1f]/10 font-semibold border border-[#ff5a1f]/20">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-[#9aa2b4] font-sans leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#22252c]">
          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition-all active:scale-[0.98]"
          >
            <span>Inspect Verified Certifications</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272b34] bg-[#131519] hover:border-white text-white text-sm font-mono transition-colors active:scale-[0.98]"
          >
            <span>See Applied in Projects</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
