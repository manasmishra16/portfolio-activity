"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PROJECTS_DATA, ProjectItem } from "@/config/site";
import { apiClient } from "@/lib/api-client";
import { ArrowUpRight, Eye, ExternalLink, Code2 } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";

interface ShowcaseGridProps {
  onSelectProject?: (project: ProjectItem) => void;
}

const CATEGORIES = [
  "All",
  "Machine Learning",
  "Data Science",
  "Full-Stack Web",
  "Creative Tech",
] as const;

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await apiClient.getProjects();
        if (isMounted && res.data && res.data.length > 0) {
          const merged = res.data.map((proj) => {
            const local = PROJECTS_DATA.find((lp) => lp.slug === proj.slug);
            return {
              ...proj,
              imageUrl:
                proj.imageUrl ||
                local?.imageUrl ||
                `/images/projects/${proj.slug}.jpg`,
            };
          });
          setProjects(merged);
        }
      } catch (err) {
        console.warn("Using local verified project data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(
    () =>
      selectedCategory === "All"
        ? projects
        : projects.filter((p) => p.category === selectedCategory),
    [projects, selectedCategory]
  );

  return (
    <section id="projects" className="relative pb-20 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#23262c]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
            <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
              FEATURED ENGINEERING SYSTEMS // 2024—2026
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Curated Projects
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                selectedCategory === cat
                  ? "bg-[#ff5a1f] text-white font-semibold shadow-[0_0_15px_rgba(255,90,31,0.4)]"
                  : "border border-[#25282e] bg-[#141619] text-[#878e9c] hover:text-white hover:border-[#383c45]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <article
            key={project.slug}
            onClick={() => {
              soundManager.playClick();
              if (onSelectProject) {
                onSelectProject(project);
              }
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative cursor-pointer flex flex-col justify-between rounded-2xl border border-[#23262c] bg-[#131518] hover:border-[#ff5a1f]/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
          >
            {/* Top Project Visual Representation Banner */}
            <div
              className="relative w-full h-64 bg-gradient-to-br from-[#1b1d22] via-[#121417] to-[#0c0d0e] border-b border-[#23262c] overflow-hidden flex items-center justify-center"
            >
              {(project.imageUrl || `/images/projects/${project.slug}.jpg`) ? (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={project.imageUrl || `/images/projects/${project.slug}.jpg`}
                    alt={`${project.title} Preview`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle dark gradient overlay for aesthetic integration with dark theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131518] via-transparent to-black/40 pointer-events-none" />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-brutalist-grid opacity-25" />

                  {/* Geometric Vector Schematic */}
                  <div className="relative z-10 w-32 h-32 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#ff5a1f]/60 transition-transform duration-700">
                    <div className="w-20 h-20 border border-white/20 rotate-12 flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
                      <div className="w-10 h-10 border border-[#ff5a1f] rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Number Watermark */}
              <span className="absolute top-4 left-4 z-10 font-mono text-xs font-bold text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 tracking-widest">
                [{project.number}]
              </span>

              {/* Year & Status Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#00ff88] border border-[#00ff88]/30 bg-[#0c0d0e]/90 backdrop-blur-sm px-2 py-0.5 rounded">
                  {project.status}
                </span>
                <span className="font-mono text-[10px] text-[#8e95a5] border border-white/10 bg-[#0c0d0e]/80 backdrop-blur-sm px-2 py-0.5 rounded">
                  {project.year}
                </span>
              </div>

              {/* Hover View Dossier Overlay Indicator */}
              <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff5a1f] text-white font-mono text-[11px] font-semibold shadow-lg">
                <Eye className="w-3.5 h-3.5" />
                <span>INSPECT DOSSIER</span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-[#ff5a1f] uppercase tracking-wider font-semibold">
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] text-[#6e7481]">
                    {(project.technologies || []).slice(0, 3).join(" • ")}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white group-hover:text-[#ff5a1f] transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="font-mono text-xs text-[#8e94a2] mb-4">
                  {project.tagline}
                </p>

                <p className="text-sm text-[#a8b1c4] line-clamp-3 leading-relaxed mb-6 font-sans">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-[#181a1f] border border-[#24272e] text-[11px] font-mono text-[#a5abb7]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Footer Metadata */}
              <div className="pt-4 border-t border-[#202328] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-mono text-[#878e9c] hover:text-white flex items-center gap-1"
                  >
                    <GitHubIcon className="w-3.5 h-3.5" />
                    <span>Repo</span>
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-mono text-[#ff5a1f] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full border border-[#2b2e35] bg-[#1a1c21] flex items-center justify-center text-[#878e9c] group-hover:bg-[#ff5a1f] group-hover:text-white group-hover:border-[#ff5a1f] transition-all"
                  title="Full Case Study"
                >
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
