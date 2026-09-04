"use client";

import React from "react";
import Link from "next/link";
import { ProjectItem } from "@/config/site";
import { X, ArrowUpRight, ExternalLink, Cpu, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire?: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire,
}) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0c0d0e]/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#121417] border border-[#26292f] rounded-2xl shadow-2xl p-6 sm:p-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          onMouseEnter={() => soundManager.playHover()}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#2b2e35] bg-[#1a1c21] flex items-center justify-center text-[#8e94a0] hover:text-white hover:border-[#ff5a1f] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30 font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="font-mono text-xs text-[#6a707d]">
            YEAR: {project.year}
          </span>
          <span className="font-mono text-xs text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded">
            {project.status}
          </span>
        </div>

        {/* Project Title */}
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-mono text-xl sm:text-2xl text-[#ff5a1f] font-bold">
            [{project.number}]
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            {project.title}
          </h2>
        </div>

        <p className="font-mono text-sm text-[#8e94a2] mb-6">
          {project.tagline}
        </p>

        {/* Graphic Architectural Preview Banner */}
        <div className="relative w-full h-52 sm:h-72 rounded-xl bg-gradient-to-br from-[#1d1f25] via-[#14161a] to-[#0c0d0e] border border-[#272a31] overflow-hidden mb-8 flex items-center justify-center">
          {project.imageUrl ? (
            <div className="relative w-full h-full">
              <img
                src={project.imageUrl}
                alt={`${project.title} Dossier Preview`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-transparent to-black/30 pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-brutalist-grid opacity-30 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-2xl border border-[#ff5a1f]/30 flex items-center justify-center animate-spin-slow mb-4">
                  <div className="w-16 h-16 border border-white/20 rotate-45 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-[#ff5a1f] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] shadow-[0_0_12px_#ff5a1f]" />
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#8e94a0] uppercase">
                  TECHNICAL DOSSIER // {project.slug}
                </span>
              </div>
            </>
          )}

          <div className="absolute bottom-4 left-6 z-10 font-mono text-xs text-[#b4bccb] bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#ff5a1f] flex items-center gap-1.5"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>github.com/{project.githubUrl.split("github.com/")[1]}</span>
            </a>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-2">
            SYSTEM OVERVIEW
          </h3>
          <p className="text-[#c7cbd4] text-base leading-relaxed font-sans">
            {project.description}
          </p>
        </div>

        {/* Technical Architecture */}
        <div className="mb-8 p-5 rounded-xl border border-[#23262c] bg-[#101215]">
          <h3 className="font-mono text-xs text-[#ff5a1f] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            PIPELINE ARCHITECTURE
          </h3>
          <p className="text-sm font-mono text-[#cbd0dc] leading-relaxed">
            {project.architecture}
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5a1f]" />
            KEY ENGINEERING FEATURES
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="text-sm text-[#cbd0dc] flex items-start gap-2.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] mt-2 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Challenges Solved */}
        <div className="mb-8">
          <h3 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-2">
            TECHNICAL CHALLENGES SOLVED
          </h3>
          <p className="text-sm text-[#a8afbd] leading-relaxed font-sans">
            {project.technicalChallenges}
          </p>
        </div>

        {/* Metrics Grid */}
        {project.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {project.metrics.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[#23262c] bg-[#16181d]"
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

        {/* Technologies List */}
        <div className="mb-8 pt-6 border-t border-[#23262c]">
          <h4 className="font-mono text-xs text-[#717682] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#ff5a1f]" />
            TECHNOLOGIES EMPLOYED
          </h4>
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg border border-[#272a31] bg-[#17191e] font-mono text-xs text-[#b8bdc8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#23262c]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6e7481]">
            <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
            <span>VERIFIED REPOSITORY // OPEN SOURCE</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2b2e35] bg-[#15171b] hover:border-white text-xs font-mono text-white transition-colors"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>Inspect Source</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-xs font-mono text-white font-semibold shadow-[0_0_15px_rgba(255,90,31,0.4)] transition-all"
              >
                <span>Launch Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
