"use client";

import React from "react";
import { Sparkles, Terminal, Database, Cpu, GraduationCap } from "lucide-react";
import { soundManager } from "@/lib/audio";
import { SITE_CONFIG } from "@/config/site";

export const ManifestoSection: React.FC = () => {
  return (
    <section id="manifesto" className="relative py-32 px-6 md:px-16 md:pl-28 max-w-7xl mx-auto border-t border-[#1a1c22]">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
        <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
          ENGINEERING PHILOSOPHY // MANAS MISHRA
        </span>
      </div>

      {/* Hero Quote Statement */}
      <div className="mb-20 max-w-5xl">
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-8">
          Bridging mathematical data modeling with{" "}
          <span className="text-[#ff5a1f]">resilient production software.</span>
        </h2>
        <p className="text-lg sm:text-xl text-[#9298a6] leading-relaxed max-w-3xl font-sans">
          Machine learning algorithms are meaningless if they remain trapped in static notebooks.
          My engineering methodology focuses on translating data signals into predictive intelligence,
          and packaging that intelligence into robust, accessible, high-performance applications.
        </p>
      </div>

      {/* Core Engineering Pillars (3 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div
          onMouseEnter={() => soundManager.playHover()}
          className="p-8 rounded-2xl border border-[#23262c] bg-[#121417] hover:border-[#ff5a1f]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f] mb-6">
            <Database className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs text-[#6e7481] uppercase tracking-wider block mb-2">
            PHASE 01
          </span>
          <h3 className="font-heading font-bold text-2xl text-white mb-3">
            Data Architecture
          </h3>
          <p className="text-sm text-[#878e9c] leading-relaxed font-sans">
            Rigorous data hygiene, outlier handling, automated variance thresholding, and relational
            database schemas (PostgreSQL / Supabase) built with ACID integrity.
          </p>
        </div>

        <div
          onMouseEnter={() => soundManager.playHover()}
          className="p-8 rounded-2xl border border-[#23262c] bg-[#121417] hover:border-[#ff5a1f]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f] mb-6">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs text-[#6e7481] uppercase tracking-wider block mb-2">
            PHASE 02
          </span>
          <h3 className="font-heading font-bold text-2xl text-white mb-3">
            Algorithmic Intelligence
          </h3>
          <p className="text-sm text-[#878e9c] leading-relaxed font-sans">
            Deploying tailored model architectures—from hybrid CNN-LSTM neural networks in TensorFlow
            to Scikit-learn ensembles—evaluating on honest cross-validation metrics.
          </p>
        </div>

        <div
          onMouseEnter={() => soundManager.playHover()}
          className="p-8 rounded-2xl border border-[#23262c] bg-[#121417] hover:border-[#ff5a1f]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f] mb-6">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs text-[#6e7481] uppercase tracking-wider block mb-2">
            PHASE 03
          </span>
          <h3 className="font-heading font-bold text-2xl text-white mb-3">
            Full-Stack Delivery
          </h3>
          <p className="text-sm text-[#878e9c] leading-relaxed font-sans">
            Serving models via low-latency asynchronous APIs (FastAPI / Flask) and building
            responsive client frontends (React 19 / Next.js) and 60 FPS WebGL 3D viewports.
          </p>
        </div>
      </div>

      {/* Verified Academic & Engineering Metrics Matrix */}
      <div className="p-8 sm:p-12 rounded-2xl border border-[#23262c] bg-gradient-to-r from-[#14161a] via-[#101114] to-[#0c0d0e] grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-1">
            7.72<span className="text-[#ff5a1f]"> CGPA</span>
          </div>
          <div className="font-mono text-xs text-[#878e9c] tracking-widest uppercase">
            KSIT BENGALURU (BE CSE)
          </div>
        </div>

        <div>
          <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-1">
            2027<span className="text-[#ff5a1f]"> GRAD</span>
          </div>
          <div className="font-mono text-xs text-[#878e9c] tracking-widest uppercase">
            EXPECTED BATCH YEAR
          </div>
        </div>

        <div>
          <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-1">
            05<span className="text-[#ff5a1f]">+</span>
          </div>
          <div className="font-mono text-xs text-[#878e9c] tracking-widest uppercase">
            VERIFIED INDUSTRY CERTS
          </div>
        </div>

        <div>
          <div className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-1">
            60<span className="text-[#ff5a1f]"> FPS</span>
          </div>
          <div className="font-mono text-xs text-[#878e9c] tracking-widest uppercase">
            WEBGL SPATIAL PERFORMANCE
          </div>
        </div>
      </div>
    </section>
  );
};
