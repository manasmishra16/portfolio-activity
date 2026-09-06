"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.replace("/admin/messages");
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    }
    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      setError("Please enter the admin secret key.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secret.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid administrative credentials.");
        setLoading(false);
        return;
      }

      // Successful login - redirect to inbox
      router.replace("/admin/messages");
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-md mx-auto py-12 sm:py-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 text-[#ff5a1f] mb-4 shadow-lg shadow-[#ff5a1f]/5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a3a3a3] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a1f]" />
            RESTRICTED ACCESS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Portfolio Administration
          </h1>
          <p className="text-sm text-[#a3a3a3]">
            Enter your secret key to access the private contact messages inbox.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[#121316]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-secret"
                className="block text-xs font-mono uppercase tracking-wider text-[#a3a3a3] mb-2"
              >
                Admin Secret Key
              </label>
              <div className="relative">
                <input
                  id="admin-secret"
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret key..."
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-[#0c0d0e] px-4 py-3 pr-12 text-sm text-white placeholder:text-[#525252] focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors p-1"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04e18] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#ff5a1f]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[11px] font-mono text-[#737373]">
              Credentials remain verified strictly server-side via encrypted session tokens.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
