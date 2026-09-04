import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { SITE_CONFIG } from "@/config/site";
import { GraduationCap, MapPin, ArrowUpRight, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Manas Mishra — Computer Science Engineer & Creative Technologist",
  description: "Learn about Manas Mishra's academic background at KSIT Bengaluru, machine learning expertise, and full-stack software engineering journey.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            BIOGRAPHY &amp; TECHNICAL PROFILE
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-8">
          Architecting systems where{" "}
          <span className="text-[#ff5a1f]">data becomes action.</span>
        </h1>

        {/* Core Narrative */}
        <div className="space-y-6 text-base sm:text-lg text-[#b8bfce] font-sans leading-[1.7] mb-12">
          <p>
            I am <strong className="text-white font-semibold">Manas Mishra</strong>, an undergraduate
            Computer Science &amp; Engineering student at <strong className="text-white">KS Institute of Technology, Bengaluru</strong> (Expected 2027),
            maintaining a consistent <strong className="text-[#ff5a1f]">7.72 CGPA</strong>.
          </p>
          <p>
            My engineering philosophy is rooted in a clear progression:{" "}
            <span className="font-mono text-white font-semibold bg-[#161820] px-2.5 py-1 rounded border border-[#272b36] text-sm">
              DATA → INTELLIGENCE → APPLICATION
            </span>
            . I believe that raw telemetry only matters when it is transformed into robust algorithmic intelligence,
            and packaged into reactive, high-performance software that people can rely on.
          </p>
          <p>
            My work spans hybrid deep learning architectures (combining 1D CNNs with LSTM recurrent layers for clinical signal detection),
            automated exploratory machine learning pipelines (MangoML for crop disease diagnosis), and full-stack systems backed by
            relational databases and reactive Next.js / Three.js 3D web applications.
          </p>
        </div>

        {/* Academic Card */}
        <div className="p-8 sm:p-10 rounded-2xl border border-[#242730] bg-[#121418] mb-14 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff5a1f] uppercase tracking-wider mb-3 font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>PRIMARY EDUCATION</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
            {SITE_CONFIG.education.degree}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-mono text-[#9199ab] mb-6">
            <span className="text-white font-medium">{SITE_CONFIG.education.institution}</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ff5a1f]" /> {SITE_CONFIG.education.location}
            </span>
            <span>Batch: 2023 — 2027</span>
            <span className="text-[#00ff88] font-semibold">CGPA: 7.72 / 10</span>
          </div>

          <p className="text-sm text-[#9da6b8] leading-relaxed font-sans border-t border-[#1f222a] pt-5">
            <strong className="text-white">Relevant Coursework:</strong> Design &amp; Analysis of Algorithms, Object-Oriented Programming (Java / C++),
            Database Management Systems (SQL), Operating Systems (Linux / Unix Internals), Machine Learning,
            Data Structures &amp; Applications, and Linear Algebra for Computing.
          </p>
        </div>

        {/* 4 Identity Pillars */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-6">
          Core Focus Areas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          <div className="p-6 rounded-xl border border-[#22252d] bg-[#111317] hover:border-[#343846] transition-colors">
            <div className="font-mono text-xs text-[#ff5a1f] mb-2.5 font-semibold tracking-wider">01 // SOFTWARE DEVELOPMENT</div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">Clean Object-Oriented Architecture</h3>
            <p className="text-sm text-[#9aa3b5] leading-relaxed font-sans">
              Proficient in Java OOP principles (certified by Infosys Springboard), modular system design, and TypeScript strong type systems.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#22252d] bg-[#111317] hover:border-[#343846] transition-colors">
            <div className="font-mono text-xs text-[#ff5a1f] mb-2.5 font-semibold tracking-wider">02 // DATA &amp; MACHINE LEARNING</div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">Predictive Pipelines &amp; Neural Nets</h3>
            <p className="text-sm text-[#9aa3b5] leading-relaxed font-sans">
              Hands-on deep learning with TensorFlow (CNN + LSTM), automated Scikit-learn pipelines, and statistical analysis in Python and R.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#22252d] bg-[#111317] hover:border-[#343846] transition-colors">
            <div className="font-mono text-xs text-[#ff5a1f] mb-2.5 font-semibold tracking-wider">03 // FULL-STACK SYSTEMS</div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">Modern Reactive Web Apps</h3>
            <p className="text-sm text-[#9aa3b5] leading-relaxed font-sans">
              Engineering with Next.js 16 (App Router), React 19, Tailwind CSS, and relational PostgreSQL / Supabase storage layers.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#22252d] bg-[#111317] hover:border-[#343846] transition-colors">
            <div className="font-mono text-xs text-[#ff5a1f] mb-2.5 font-semibold tracking-wider">04 // CREATIVE TECHNOLOGY</div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">60 FPS 3D WebGL Workstations</h3>
            <p className="text-sm text-[#9aa3b5] leading-relaxed font-sans">
              Blending mathematical 3D shaders, React Three Fiber zero-gravity simulations, and Web Audio API real-time acoustic feedback.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[#22252c]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7700] text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition-all active:scale-[0.98]"
          >
            <span>Inspect Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272b34] bg-[#131519] hover:border-white text-white text-sm font-mono transition-colors active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-[#ff5a1f]" />
            <span>View Resume</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#272b34] bg-[#131519] hover:border-[#ff5a1f] text-[#9aa2b4] hover:text-white text-sm font-mono transition-colors active:scale-[0.98]"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
