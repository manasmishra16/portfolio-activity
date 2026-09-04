"use client";

import React, { useState } from "react";
import { Plus, Minus, ArrowUpRight, CheckCircle2, Cpu, Database, Layout, Server } from "lucide-react";
import { soundManager } from "@/lib/audio";

interface ServicesAccordionProps {
  onInquireService?: (serviceName: string) => void;
}

const DISCIPLINES_DATA = [
  {
    id: "01",
    title: "Deep Learning & Neural Architectures",
    icon: Cpu,
    summary:
      "Designing and training specialized deep neural networks for classification and pattern recognition. Experienced in 1D/2D CNNs for spatial signal feature extraction and recurrent LSTM networks for sequential dependency modeling using TensorFlow.",
    tags: ["TensorFlow 2.x", "CNN", "LSTM", "Batch Normalization", "Regularization", "Model Evaluation"],
    deliverables: "Trained Model Weights (.h5 / SavedModel), Evaluation Loss Curves, Inference Benchmark Scripts",
  },
  {
    id: "02",
    title: "Automated Data Engineering & Scikit-Learn Pipelines",
    icon: Database,
    summary:
      "Building automated exploratory data analysis, data wrangling, and ensemble model pipelines. Developed MangoML for automated crop disease classification with robust feature scaling and stratified cross-validation.",
    tags: ["Scikit-learn", "Pandas", "NumPy", "Feature Scaling", "Ensemble Methods", "R Programming"],
    deliverables: "Reproducible Data Transformation Pipelines, Hyperparameter Benchmark Reports, Clean Datasets",
  },
  {
    id: "03",
    title: "Full-Stack Web & Relational Database Architecture",
    icon: Layout,
    summary:
      "Architecting responsive, modern web applications in React 19, Next.js (App Router), and TypeScript backed by PostgreSQL relational databases. Built atomic PG hostel reservation systems with PLpgSQL stored procedures and Supabase.",
    tags: ["Next.js (App Router)", "React 19", "PostgreSQL", "Supabase", "Tailwind CSS", "PLpgSQL"],
    deliverables: "Production Web Applications, Relational Schemas, ACID Transaction Triggers, Responsive UI",
  },
  {
    id: "04",
    title: "Inference API Microservices & Creative WebGL",
    icon: Server,
    summary:
      "Deploying machine learning models behind low-latency asynchronous REST APIs using FastAPI and Flask. Exploring creative engineering through 60 FPS zero-gravity Three.js WebGL shaders and Web Audio API synthesis.",
    tags: ["FastAPI", "Flask", "Three.js", "React Three Fiber", "Web Audio API", "RESTful Architecture"],
    deliverables: "Stateless Microservices, Interactive 3D Spatial Canvas, OpenAPI Docs, Real-Time Audio Feedback",
  },
];

export const ServicesAccordion: React.FC<ServicesAccordionProps> = ({
  onInquireService,
}) => {
  const [activeId, setActiveId] = useState<string | null>("01");

  const toggleAccordion = (id: string) => {
    soundManager.playClick();
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="disciplines" className="relative py-32 px-6 md:px-16 md:pl-28 max-w-7xl mx-auto border-t border-[#1a1c22]">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#23262c]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
            <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
              TECHNICAL EXPERTISE // DISCIPLINARY STACK
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Engineering Disciplines
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#878e9c] max-w-sm mt-4 md:mt-0 font-sans">
          From multi-layer neural networks in TensorFlow to production full-stack systems and 60 FPS WebGL 3D viewports.
        </p>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-[#23262c]">
        {DISCIPLINES_DATA.map((discipline) => {
          const isOpen = activeId === discipline.id;
          const Icon = discipline.icon;

          return (
            <div
              key={discipline.id}
              className="py-8 transition-colors duration-300"
            >
              {/* Accordion Row Header */}
              <button
                onClick={() => toggleAccordion(discipline.id)}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className="font-mono text-lg sm:text-2xl font-bold text-[#ff5a1f]">
                    {discipline.id}
                  </span>
                  <h3 className="font-heading font-bold text-xl sm:text-3xl md:text-4xl text-white group-hover:text-[#ff5a1f] transition-colors flex items-center gap-3">
                    <span>{discipline.title}</span>
                  </h3>
                </div>

                <div
                  className={`w-10 h-10 rounded-full border border-[#2b2e35] flex items-center justify-center transition-all ${
                    isOpen
                      ? "bg-[#ff5a1f] text-white border-[#ff5a1f]"
                      : "bg-[#14161a] text-[#878e9c] group-hover:border-[#ff5a1f]"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isOpen && (
                <div className="pt-6 pl-12 md:pl-20 animate-[fadeIn_0.3s_ease-out]">
                  <p className="text-base sm:text-lg text-[#c5c9d4] leading-relaxed max-w-3xl mb-6 font-sans">
                    {discipline.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {discipline.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full border border-[#272a31] bg-[#16181d] font-mono text-xs text-[#a2a8b6] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#ff5a1f]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Typical Artifacts */}
                  <div className="p-4 rounded-xl border border-[#23262c] bg-[#111316] flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl">
                    <div className="text-xs font-mono text-[#787e8d]">
                      <span className="text-[#a5abb8] uppercase font-semibold block mb-0.5">
                        Key Deliverables &amp; Artifacts:
                      </span>
                      {discipline.deliverables}
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onInquireService?.(discipline.title);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff5a1f]/15 hover:bg-[#ff5a1f] text-[#ff5a1f] hover:text-white border border-[#ff5a1f]/30 transition-colors font-mono text-xs font-semibold uppercase whitespace-nowrap"
                    >
                      <span>Discuss Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
