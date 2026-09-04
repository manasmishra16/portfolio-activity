"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Send, CheckCircle2, Clock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";
import { SITE_CONFIG } from "@/config/site";
import { apiClient } from "@/lib/api-client";
import confetti from "canvas-confetti";

interface ContactFooterProps {
  initialProjectName?: string;
}

interface WorldClock {
  city: string;
  tz: string;
  time: string;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  initialProjectName = "",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    initialProjectName ? `Discussion on ${initialProjectName}` : "General Engineering Inquiry"
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clocks, setClocks] = useState<WorldClock[]>([
    { city: "BENGALURU", tz: "Asia/Kolkata", time: "--:--" },
    { city: "SAN FRANCISCO", tz: "America/Los_Angeles", time: "--:--" },
    { city: "LONDON", tz: "Europe/London", time: "--:--" },
    { city: "TOKYO", tz: "Asia/Tokyo", time: "--:--" },
  ]);

  useEffect(() => {
    if (initialProjectName) {
      setSubject(`Discussion on ${initialProjectName}`);
    }
  }, [initialProjectName]);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setClocks((prev) =>
        prev.map((c) => {
          try {
            const timeStr = now.toLocaleTimeString("en-GB", {
              timeZone: c.tz,
              hour: "2-digit",
              minute: "2-digit",
            });
            return { ...c, time: timeStr };
          } catch {
            return c;
          }
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.sendContactMessage({ name, email, subject, message });

      soundManager.playWhoosh();

      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.85 },
          colors: ["#ff5a1f", "#ff7700", "#ffffff", "#2b2e35"],
        });
      } catch {
        // Fallback
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="relative pt-2 pb-16">
      {/* Global Studio Clocks Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-[#22252e] bg-[#121418] mb-14 shadow-lg">
        {clocks.map((c) => (
          <div key={c.city} className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#ff5a1f]" />
            <div>
              <span className="font-mono text-[10px] text-[#636875] tracking-wider uppercase block">
                {c.city}
              </span>
              <span className="font-mono text-sm text-white font-semibold">
                {c.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        {/* Left Headline & Overview */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
              <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
                INITIATE CONTACT // COLLABORATION
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[1.08] mb-6">
              Building intelligent systems? <br />
              <span className="text-[#ff5a1f]">Let&apos;s connect.</span>
            </h2>

            <p className="text-base text-[#9297a5] leading-relaxed max-w-lg mb-8 font-sans">
              Currently pursuing a Bachelor of Engineering in Computer Science &amp; Engineering at
              KS Institute of Technology, Bengaluru (Expected 2027). Available for software engineering
              internships, machine learning roles, and collaborative projects.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#202227]">
            <div className="font-mono text-xs text-[#6e7481]">
              DIRECT INBOX //{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-white hover:text-[#ff5a1f] transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            <div className="font-mono text-xs text-[#6e7481]">
              GITHUB REMOTE //{" "}
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#ff5a1f] transition-colors"
              >
                github.com/{SITE_CONFIG.handle}
              </a>
            </div>
            <div className="font-mono text-xs text-[#6e7481]">
              LOCATION // <span className="text-white">Bengaluru, Karnataka, India</span>
            </div>
          </div>
        </div>

        {/* Right Validated Contact Form Card */}
        <div className="lg:col-span-6 p-8 sm:p-10 rounded-2xl border border-[#26292f] bg-[#131518] shadow-2xl relative">
          {submitted ? (
            <div className="py-16 text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#ff5a1f]/20 border border-[#ff5a1f] flex items-center justify-center mx-auto mb-6 text-[#ff5a1f]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-3xl text-white mb-3">
                Transmission Recorded
              </h3>
              <p className="text-sm text-[#878e9c] max-w-sm mx-auto font-sans leading-relaxed mb-6">
                Your message has been processed through the contact API and transmitted to Manas Mishra.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
                className="font-mono text-xs text-[#ff5a1f] hover:underline uppercase tracking-wider cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] text-[#717684] uppercase tracking-wider mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-[#292c33] bg-[#0e1012] text-white placeholder-[#454a55] text-sm focus:outline-none focus:border-[#ff5a1f] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-[#717684] uppercase tracking-wider mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#292c33] bg-[#0e1012] text-white placeholder-[#454a55] text-sm focus:outline-none focus:border-[#ff5a1f] transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-mono text-[11px] text-[#717684] uppercase tracking-wider mb-2">
                  SUBJECT / TOPIC
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Internship Opportunity / ML Collaboration"
                  className="w-full px-4 py-3 rounded-xl border border-[#292c33] bg-[#0e1012] text-white placeholder-[#454a55] text-sm focus:outline-none focus:border-[#ff5a1f] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-mono text-[11px] text-[#717684] uppercase tracking-wider mb-2">
                  MESSAGE BRIEF *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, team opportunity, or discussion points..."
                  className="w-full px-4 py-3 rounded-xl border border-[#292c33] bg-[#0e1012] text-white placeholder-[#454a55] text-sm focus:outline-none focus:border-[#ff5a1f] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => soundManager.playHover()}
                className="w-full py-4 rounded-xl bg-[#ff5a1f] hover:bg-[#ff7700] disabled:opacity-50 text-white font-semibold text-sm shadow-[0_0_25px_rgba(255,90,31,0.4)] hover:shadow-[0_0_35px_rgba(255,90,31,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
