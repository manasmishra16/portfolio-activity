import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { NOTES_DATA } from "@/config/site";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes & Technical Writing — Manas Mishra",
  description: "Technical essays and engineering logs on machine learning architectures, automated diagnostics, and 3D web graphics by Manas Mishra.",
};

export default function NotesPage() {
  return (
    <PageShell>
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            TECHNICAL WRITING // ENGINEERING LOGS
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-4">
          Notes &amp; Insights
        </h1>
        <p className="text-base sm:text-lg text-[#a2aab9] max-w-3xl font-sans leading-relaxed mb-12">
          Deep-dives into neural network design, automated feature engineering strategies,
          and high-performance 3D spatial computing in the browser.
        </p>

        {/* Notes List */}
        <div className="space-y-6 mb-16">
          {NOTES_DATA.map((note) => (
            <article
              key={note.slug}
              className="p-6 sm:p-8 rounded-2xl border border-[#22252e] bg-[#121418] hover:border-[#ff5a1f]/50 transition-all group shadow-lg"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#808899] mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  {note.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {note.readTime}
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white group-hover:text-[#ff5a1f] transition-colors mb-3">
                <Link href={`/notes/${note.slug}`}>
                  {note.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-[#b4bccb] font-sans leading-relaxed mb-6">
                {note.summary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1e2129]">
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md bg-[#16181e] border border-[#242732] text-xs font-mono text-[#c0c7d6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/notes/${note.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#ff5a1f] group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
