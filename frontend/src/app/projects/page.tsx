import React from "react";
import { PageShell } from "@/components/ui/PageShell";
import { ShowcaseGrid } from "@/components/ui/ShowcaseGrid";
import { GitHubSection } from "@/components/ui/GitHubSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Systems — Manas Mishra",
  description: "Machine learning architectures, automated diagnostic tools, and full-stack applications built by Manas Mishra.",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            SOFTWARE &amp; MACHINE LEARNING REPERTOIRE
          </span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-4">
          Engineered Systems
        </h1>
        <p className="text-base sm:text-lg text-[#a2aab9] max-w-3xl font-sans leading-relaxed">
          Production and research architectures spanning hybrid deep learning for clinical signal detection,
          automated crop pathology diagnostics, institutional resource allocation, and zero-gravity WebGL applications.
        </p>
      </div>

      <ShowcaseGrid />
      <GitHubSection />
    </PageShell>
  );
}
