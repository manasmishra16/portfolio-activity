import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { NOTES_DATA } from "@/config/site";
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return NOTES_DATA.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES_DATA.find((n) => n.slug === slug);
  if (!note) return { title: "Note Not Found" };

  return {
    title: `${note.title} — Manas Mishra`,
    description: note.summary,
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = NOTES_DATA.find((n) => n.slug === slug);

  if (!note) {
    notFound();
  }

  return (
    <PageShell>
      <article className="max-w-3xl">
        {/* Back Link */}
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#878e9c] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL NOTES</span>
        </Link>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#787e8d] mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#ff5a1f]" />
            {note.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {note.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[52px] text-white tracking-[-0.03em] leading-[1.06] mb-6">
          {note.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#23262c]">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[#16181d] border border-[#23262c] text-xs font-mono text-[#a2a8b6]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-[#c2c7d2] font-sans leading-relaxed space-y-6 text-base sm:text-lg">
          <div className="p-6 rounded-2xl border border-[#23262c] bg-[#111316] font-mono text-xs sm:text-sm text-[#878e9c] mb-8 leading-relaxed">
            <span className="text-[#ff5a1f] font-semibold block mb-1 uppercase tracking-wider">
              EXECUTIVE SUMMARY
            </span>
            {note.summary}
          </div>

          <div className="whitespace-pre-line font-sans text-[#b0b6c4]">
            {note.content}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-10 mt-12 border-t border-[#23262c] flex items-center justify-between">
          <Link
            href="/notes"
            className="text-xs font-mono text-[#878e9c] hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>More Notes</span>
          </Link>

          <Link
            href="/contact"
            className="text-xs font-mono text-[#ff5a1f] hover:underline"
          >
            Discuss with Manas →
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
