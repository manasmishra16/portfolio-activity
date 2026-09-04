import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PROJECTS_DATA, ProjectItem } from "@/config/site";
import { ArrowLeft, ArrowUpRight, ExternalLink, Cpu, Layers, CheckCircle2, ShieldCheck } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Technical Case Study | Manas Mishra`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#878e9c] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL PROJECTS</span>
        </Link>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30 font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="font-mono text-xs text-[#787e8d]">
            YEAR: {project.year}
          </span>
          <span className="font-mono text-xs text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded">
            {project.status}
          </span>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-3">
          {project.title}
        </h1>
        <p className="font-mono text-sm sm:text-base text-[#9aa2b5] mb-8">
          {project.tagline}
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#272a31] bg-[#14161a] hover:border-white text-xs font-mono text-white transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-[#6e7481]" />
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-xs font-mono text-white font-semibold shadow-[0_0_15px_rgba(255,90,31,0.4)] transition-all"
            >
              <span>Launch Live Interface</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Project Demo Graphic Banner */}
        {(project.imageUrl || `/images/projects/${project.slug}.jpg`) && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#23262c] mb-12 shadow-2xl">
            <img
              src={project.imageUrl || `/images/projects/${project.slug}.jpg`}
              alt={`${project.title} Interface Graphic`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1013] via-transparent to-black/30 pointer-events-none" />
            <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#ff5a1f] tracking-widest uppercase bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-[#ff5a1f]/30">
              SYSTEM TELEMETRY VISUALIZATION
            </span>
          </div>
        )}

        {/* Metrics Grid */}
        {project.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {project.metrics.map((stat, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-[#23262c] bg-[#14161a]"
              >
                <div className="font-mono text-[11px] text-[#6e7481] uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="font-heading text-xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System Overview */}
        <section className="mb-12">
          <h2 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-3">
            SYSTEM OVERVIEW &amp; OBJECTIVES
          </h2>
          <p className="text-[#c7cbd4] text-base sm:text-lg leading-relaxed font-sans">
            {project.description}
          </p>
        </section>

        {/* Architecture Box */}
        <section className="mb-12 p-6 sm:p-8 rounded-2xl border border-[#23262c] bg-[#111316]">
          <h2 className="font-mono text-xs text-[#ff5a1f] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            TECHNICAL PIPELINE ARCHITECTURE
          </h2>
          <p className="font-mono text-sm text-[#cbd0dc] leading-relaxed bg-[#0c0d0e] p-4 rounded-xl border border-[#1f2228]">
            {project.architecture}
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff5a1f]" />
            KEY ENGINEERING HIGHLIGHTS
          </h2>
          <ul className="space-y-3">
            {project.keyFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="text-sm sm:text-base text-[#cbd0dc] flex items-start gap-3 font-sans p-3 rounded-lg border border-[#1c1e23] bg-[#121417]"
              >
                <span className="w-2 h-2 rounded-full bg-[#ff5a1f] mt-2 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Challenges */}
        <section className="mb-12">
          <h2 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-3">
            CHALLENGES &amp; OPTIMIZATIONS
          </h2>
          <p className="text-sm sm:text-base text-[#a8afbd] leading-relaxed font-sans">
            {project.technicalChallenges}
          </p>
        </section>

        {/* Technologies Stack */}
        <section className="mb-12 pt-8 border-t border-[#23262c]">
          <h2 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff5a1f]" />
            TECHNOLOGY STACK
          </h2>
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).map((t) => (
              <span
                key={t}
                className="px-3.5 py-1.5 rounded-lg border border-[#272a31] bg-[#16181d] font-mono text-xs text-[#b8bdc8]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Footer Navigation between Projects */}
        <div className="pt-8 border-t border-[#23262c] flex items-center justify-between">
          <Link
            href="/projects"
            className="text-xs font-mono text-[#878e9c] hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-[#ff5a1f] hover:underline flex items-center gap-1.5"
          >
            <span>Star on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </PageShell>
  );
}
