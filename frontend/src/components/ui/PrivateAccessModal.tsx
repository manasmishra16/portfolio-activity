"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, X } from "lucide-react";

interface PrivateAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateAccessModal: React.FC<PrivateAccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAccessKey("");
      setError(null);
      setLoading(false);
      // Auto-focus input after modal renders
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: accessKey.trim() }),
      });

      if (!res.ok) {
        setError("Access denied");
        setLoading(false);
        inputRef.current?.focus();
        return;
      }

      // Success: dismiss modal and navigate to messages inbox
      onClose();
      router.push("/admin/messages");
    } catch {
      setError("Access denied");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="private-access-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121316] p-6 shadow-2xl text-[#ededed] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 flex items-center justify-center text-[#ff5a1f] shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2
              id="private-access-title"
              className="text-xs font-mono uppercase tracking-widest text-[#ededed] font-semibold"
            >
              Private Access
            </h2>
            <p className="text-[11px] text-[#737373]">
              Enter access credentials to continue.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                ref={inputRef}
                type={showKey ? "text" : "password"}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key..."
                disabled={loading}
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-[#0c0d0e] px-3.5 py-2.5 pr-10 text-xs text-white placeholder:text-[#525252] focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition-colors font-mono disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors p-1"
                aria-label={showKey ? "Hide key" : "Show key"}
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-[11px] font-mono text-rose-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-mono text-[#a3a3a3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !accessKey.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04e18] text-xs font-medium text-white shadow-md shadow-[#ff5a1f]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Authenticate</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
