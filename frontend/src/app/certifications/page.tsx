import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { CERTIFICATIONS_DATA } from "@/config/site";
import { CheckCircle2, Award, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications & Credentials — Manas Mishra",
  description: "Verified professional certifications in Data Analytics, Database Management, and Software Engineering held by Manas Mishra.",
};

export default function CertificationsPage() {
  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            VERIFIED INDUSTRY CREDENTIALS
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-4">
          Certifications
        </h1>
        <p className="text-base sm:text-lg text-[#a2aab9] max-w-3xl font-sans leading-relaxed mb-12">
          Curated industry-recognized credentials demonstrating rigorous mastery of data analytics,
          relational databases, object-oriented software engineering, and operating system toolchains.
        </p>

        {/* Certifications Cards List */}
        <div className="space-y-6 mb-16">
          {CERTIFICATIONS_DATA.map((cert) => (
            <div
              key={cert.id}
              className="p-6 sm:p-8 rounded-2xl border border-[#22252e] bg-[#121418] hover:border-[#ff5a1f]/50 transition-all shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30">
                    {cert.issuer}
                  </span>
                  <span className="font-mono text-xs text-[#808899]">
                    {cert.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-[#00ff88]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Credential</span>
                </div>
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
                {cert.title}
              </h2>

              <p className="text-sm sm:text-base text-[#b4bccb] font-sans leading-relaxed mb-6">
                {cert.highlight}
              </p>

              <div>
                <span className="font-mono text-xs text-[#71798a] block mb-2 font-medium">
                  Covered Competencies:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cert.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-md bg-[#16181e] border border-[#232630] text-xs font-mono text-[#c0c7d6]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#22252c]">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition-all active:scale-[0.98]"
          >
            <span>Review Full Skill Matrix</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272b34] bg-[#131519] hover:border-white text-white text-sm font-mono transition-colors active:scale-[0.98]"
          >
            <Award className="w-4 h-4 text-[#ff5a1f]" />
            <span>Interactive Resume</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
