import React from "react";
import { PageShell } from "@/components/ui/PageShell";
import { ContactFooter } from "@/components/ui/ContactFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Inquiries — Manas Mishra",
  description: "Get in touch with Manas Mishra for software engineering roles, machine learning internships, or technical collaborations.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
          <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
            DIRECT INQUIRY &amp; COMMUNICATIONS
          </span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.04] mb-4">
          Initiate Dialogue
        </h1>
        <p className="text-base sm:text-lg text-[#a2aab9] max-w-3xl font-sans leading-relaxed">
          Available for software engineering internships, machine learning positions, and technical collaborations.
          Fill in your details below to send an encrypted message directly to my portfolio API.
        </p>
      </div>

      <ContactFooter />
    </PageShell>
  );
}
