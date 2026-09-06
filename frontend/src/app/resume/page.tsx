"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { SITE_CONFIG, PROJECTS_DATA, CERTIFICATIONS_DATA, SKILLS_CONFIG } from "@/config/site";
import { apiClient } from "@/lib/api-client";
import { Download, Printer, ArrowLeft, ExternalLink, Mail, MapPin } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";

export default function ResumePage() {
  const [profileData, setProfileData] = useState(SITE_CONFIG);

  useEffect(() => {
    let isMounted = true;
    async function loadResume() {
      try {
        const res = await apiClient.getResumeMetadata();
        if (isMounted && res.data?.profile) {
          // Sync live profile data if available
        }
      } catch (err) {
        console.warn("Using local verified resume data:", err);
      }
    }
    loadResume();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    soundManager.playClick();
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <PageShell>
      <div className="max-w-[880px] mx-auto">
        {/* Header Action Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#1f2229] print:hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] shrink-0 shadow-[0_0_6px_rgba(255,90,31,0.8)]" />
              <span className="font-mono text-[10px] sm:text-xs text-[#878e9c] tracking-[0.25em] uppercase font-semibold">
                CURRICULUM VITAE // VERIFIED CREDENTIALS
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white tracking-[-0.02em]">
              Resume <span className="text-[#d8dee8]">Dossier</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              onMouseEnter={() => soundManager.playHover()}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 sm:px-5 rounded-full border border-[#272a31] bg-[#14161a] hover:border-[#404552] text-xs font-mono text-[#c5cbd6] hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f]"
              aria-label="Print or save portfolio Resume Dossier"
            >
              <Printer className="w-3.5 h-3.5 shrink-0 text-[#8a909f]" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>

            <a
              href="/resume/Manas_Mishra_ATS_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 sm:px-5 rounded-full bg-[#ff5a1f] hover:bg-[#ff6f33] text-xs font-mono text-white font-semibold shadow-[0_0_15px_rgba(255,90,31,0.35)] hover:shadow-[0_0_22px_rgba(255,90,31,0.5)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0d0e]"
              aria-label="Open original ATS Resume PDF in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Request Direct PDF</span>
            </a>
          </div>
        </div>

        {/* PRINTABLE RESUME SHEET */}
        <div className="p-5 sm:p-9 md:p-12 rounded-2xl border border-[#1f2229] bg-[#101215] text-[#c5cbd6] font-sans shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          {/* Header */}
          <div className="border-b border-[#1f2229] pb-8 mb-8">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-1.5 uppercase">
              {SITE_CONFIG.name}
            </h2>
            <div className="font-mono text-xs text-[#ff5a1f] font-semibold tracking-wider uppercase mb-4">
              DATA → INTELLIGENCE → APPLICATION // COMPUTER SCIENCE ENGINEER
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 sm:gap-x-6 text-xs font-mono text-[#8a909f]">
              <span className="flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0" />
                <span>{SITE_CONFIG.education.location}</span>
              </span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-1.5 text-white hover:underline break-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-white hover:underline break-all"
              >
                <GitHubIcon className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0" />
                <span>github.com/{SITE_CONFIG.handle}</span>
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-white hover:underline break-all"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0" />
                <span>linkedin.com/in/manas16</span>
              </a>
            </div>
          </div>

          {/* Education */}
          <section className="mb-8 pb-8 border-b border-[#1c1f26]">
            <h3 className="font-mono text-xs font-bold text-[#ff5a1f] uppercase tracking-[0.25em] mb-4">
              EDUCATION
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
              <h4 className="font-heading font-bold text-xl text-white">
                {SITE_CONFIG.education.institution}
              </h4>
              <span className="font-mono text-xs text-[#878e9c]">
                Bengaluru, India | 2023 — 2027
              </span>
            </div>

            <div className="text-sm font-mono text-[#cbd1de] mb-2">
              {SITE_CONFIG.education.degree} — <span className="text-[#00ff88] font-semibold">CGPA: 7.72 / 10</span>
            </div>

            <p className="text-xs text-[#878e9c] leading-relaxed">
              Coursework: Design &amp; Analysis of Algorithms, Object-Oriented Programming (Java), Database Management Systems,
              Operating Systems (Linux/Unix), Machine Learning, Data Structures, Computer Networks.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8 pb-8 border-b border-[#1c1f26]">
            <h3 className="font-mono text-xs font-bold text-[#ff5a1f] uppercase tracking-[0.25em] mb-4">
              TECHNICAL PROFICIENCIES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-white font-semibold block mb-1">PROGRAMMING:</span>
                <span className="text-[#8e94a2]">Java (OOPs), Python, JavaScript, TypeScript, C/C++</span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">DATA &amp; MACHINE LEARNING:</span>
                <span className="text-[#8e94a2]">TensorFlow (CNN, LSTM), Scikit-learn, Pandas, NumPy, R</span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">WEB &amp; FULL-STACK:</span>
                <span className="text-[#8e94a2]">React 19, Next.js (App Router), Three.js, Tailwind CSS</span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">BACKEND &amp; DATABASES:</span>
                <span className="text-[#8e94a2]">FastAPI, Flask, PostgreSQL, Supabase, SQL, PLpgSQL</span>
              </div>
              <div>
                <span className="text-white font-semibold block mb-1">SYSTEM TOOLS:</span>
                <span className="text-[#8e94a2]">Git, GitHub, Linux Shell Scripting, PowerShell, Vercel</span>
              </div>
            </div>
          </section>

          {/* Selected Projects */}
          <section className="mb-8 pb-8 border-b border-[#1c1f26]">
            <h3 className="font-mono text-xs font-bold text-[#ff5a1f] uppercase tracking-[0.25em] mb-4">
              ENGINEERING PROJECTS
            </h3>

            <div className="space-y-6">
              {PROJECTS_DATA.map((proj) => (
                <div key={proj.slug}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h4 className="font-heading font-bold text-lg text-white">
                      {proj.title}
                    </h4>
                    <span className="font-mono text-xs text-[#878e9c]">
                      {proj.year} | {proj.category}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-[#ff5a1f] mb-2">
                    Tech: {proj.technologies.join(", ")}
                  </div>

                  <p className="text-xs text-[#9aa0ae] font-sans leading-relaxed mb-2">
                    {proj.description}
                  </p>

                  <div className="text-[11px] font-mono text-[#717684]">
                    Architecture: {proj.architecture}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-8">
            <h3 className="font-mono text-xs font-bold text-[#ff5a1f] uppercase tracking-[0.25em] mb-4">
              VERIFIED CERTIFICATIONS
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              {CERTIFICATIONS_DATA.map((cert) => (
                <div key={cert.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-[#1c1e24]">
                  <span className="text-white font-medium">{cert.title}</span>
                  <div className="flex items-center gap-4 text-[#878e9c]">
                    <span>{cert.issuer}</span>
                    <span className="text-[#00ff88]">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
