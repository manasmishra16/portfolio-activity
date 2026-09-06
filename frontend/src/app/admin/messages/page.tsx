"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { formatAdminDate, formatAdminDateWithZone } from "@/lib/date-utils";
import {
  Inbox,
  Search,
  RefreshCw,
  LogOut,
  Mail,
  CheckCircle2,
  Clock,
  Archive,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Send,
  Sparkles,
} from "lucide-react";

interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived" | string;
  email_notification_sent: boolean;
  created_at: string | null;
  updated_at?: string | null;
}

interface MessageCounts {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [counts, setCounts] = useState<MessageCounts>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch messages from Next.js server proxy
  const fetchMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());

      const res = await fetch(`/api/admin/messages?${params.toString()}`, {
        cache: "no-store",
      });

      if (res.status === 401) {
        // Unauthorized: redirect to login
        router.replace("/admin");
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to load messages (${res.status})`);
      }

      const data = await res.json();
      const items: ContactMessageItem[] = data.items || data.messages || [];
      setMessages(items);

      if (data.counts) {
        setCounts(data.counts);
      }

      // Update selected message reference if it's still in the list
      setSelectedMessage((prev) => {
        if (!prev) return null;
        return items.find((m) => m.id === prev.id) || prev;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to message service";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, debouncedSearch, router]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Status update handler
  const handleUpdateStatus = async (id: string, newStatus: "new" | "read" | "replied" | "archived") => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updatedMsg: ContactMessageItem = await res.json();

      // Update in-memory state smoothly
      setMessages((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updatedMsg.status } : item))
      );

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: updatedMsg.status } : null));
      }

      // Refresh counts
      fetchMessages(true);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      startTransition(() => {
        router.replace("/admin");
      });
    }
  };

  // Date formatting helpers delegating to centralized timezone utility (Asia/Kolkata)
  const formatDate = (isoString: string | null | undefined) => formatAdminDate(isoString);

  return (
    <PageShell>
      <div className="w-full max-w-6xl mx-auto py-6 sm:py-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 text-[11px] font-mono uppercase tracking-wider text-[#ff5a1f]">
                <Sparkles className="w-3 h-3" /> Private Console
              </span>
              <span className="text-xs text-[#737373] font-mono">• PostgreSQL / Supabase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Inbox className="w-7 h-7 text-[#ff5a1f]" />
              Inquiries Inbox
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchMessages(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#ededed] transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh messages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#ff5a1f]" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-mono text-rose-300 transition-colors cursor-pointer"
              title="End session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Stats Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <button
            onClick={() => setStatusFilter("all")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === "all"
                ? "border-[#ff5a1f] bg-[#ff5a1f]/5 ring-1 ring-[#ff5a1f]"
                : "border-white/10 bg-[#121316]/60 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-[#a3a3a3]">All Inquiries</div>
            <div className="text-2xl font-bold text-white mt-1">{counts.total}</div>
          </button>

          <button
            onClick={() => setStatusFilter("new")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === "new"
                ? "border-[#ff5a1f] bg-[#ff5a1f]/10 ring-1 ring-[#ff5a1f]"
                : "border-white/10 bg-[#121316]/60 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-[#ff5a1f] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5a1f] animate-pulse" />
              New
            </div>
            <div className="text-2xl font-bold text-[#ff5a1f] mt-1">{counts.new}</div>
          </button>

          <button
            onClick={() => setStatusFilter("read")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === "read"
                ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500"
                : "border-white/10 bg-[#121316]/60 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-sky-400">Read</div>
            <div className="text-2xl font-bold text-white mt-1">{counts.read}</div>
          </button>

          <button
            onClick={() => setStatusFilter("replied")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === "replied"
                ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                : "border-white/10 bg-[#121316]/60 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-emerald-400">Replied</div>
            <div className="text-2xl font-bold text-white mt-1">{counts.replied}</div>
          </button>

          <button
            onClick={() => setStatusFilter("archived")}
            className={`col-span-2 sm:col-span-1 p-4 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === "archived"
                ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500"
                : "border-white/10 bg-[#121316]/60 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-purple-400">Archived</div>
            <div className="text-2xl font-bold text-white mt-1">{counts.archived}</div>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject, or message text..."
              className="w-full rounded-xl border border-white/10 bg-[#121316] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-[#525252] focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-[#121316] overflow-x-auto">
            {["all", "new", "read", "replied", "archived"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider capitalize transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#ff5a1f] text-white font-medium"
                    : "text-[#a3a3a3] hover:text-white hover:bg-white/5"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Failed to load message transmissions</p>
              <p className="text-rose-400/90">{error}</p>
            </div>
            <button
              onClick={() => fetchMessages()}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-mono"
            >
              Retry
            </button>
          </div>
        )}

        {/* Master / Detail Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Message List View */}
          <div className={`space-y-3 ${selectedMessage ? "hidden lg:block lg:col-span-5" : "col-span-12"}`}>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-white/5 bg-[#121316]/50 p-4 space-y-2.5"
                  >
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#121316]/50 p-12 text-center">
                <MessageSquare className="w-10 h-10 text-[#525252] mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">No messages found</h3>
                <p className="text-xs text-[#737373] max-w-sm mx-auto">
                  {searchQuery
                    ? `No transmissions match your search query "${searchQuery}".`
                    : statusFilter !== "all"
                    ? `No inquiries currently marked as ${statusFilter}.`
                    : "Your inbox is currently empty. New contact form transmissions will appear here."}
                </p>
              </div>
            ) : (
              messages.map((item) => {
                const isSelected = selectedMessage?.id === item.id;
                const isNew = item.status === "new";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMessage(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? "border-[#ff5a1f] bg-[#ff5a1f]/10 shadow-lg shadow-[#ff5a1f]/5"
                        : isNew
                        ? "border-[#ff5a1f]/40 bg-[#121316] hover:border-[#ff5a1f]/70"
                        : "border-white/10 bg-[#121316]/60 hover:border-white/20 hover:bg-[#121316]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isNew && <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shrink-0" />}
                        <span className="text-sm font-semibold text-white truncate max-w-[200px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#737373] whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#ededed] mb-1 line-clamp-1">
                      {item.subject}
                    </div>

                    <div className="text-xs text-[#a3a3a3] line-clamp-2 mb-3">
                      {item.message}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px] font-semibold ${
                            item.status === "new"
                              ? "bg-[#ff5a1f]/20 text-[#ff5a1f]"
                              : item.status === "read"
                              ? "bg-sky-500/20 text-sky-300"
                              : item.status === "replied"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {item.status}
                        </span>

                        {item.email_notification_sent ? (
                          <span className="text-emerald-400/80 flex items-center gap-1" title="Notification delivered via Resend">
                            <CheckCircle2 className="w-3 h-3" /> Resend OK
                          </span>
                        ) : (
                          <span className="text-[#737373] flex items-center gap-1" title="Saved safely in PostgreSQL database">
                            <Clock className="w-3 h-3" /> In DB
                          </span>
                        )}
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-[#525252]" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Detail View */}
          {selectedMessage && (
            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#121316] p-6 sm:p-8 backdrop-blur-xl sticky top-28 shadow-xl">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="lg:hidden mb-4 inline-flex items-center gap-1 text-xs font-mono text-[#ff5a1f] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to inbox list
                </button>

                {/* Detail Header */}
                <div className="border-b border-white/10 pb-6 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full uppercase tracking-wider text-xs font-semibold ${
                          selectedMessage.status === "new"
                            ? "bg-[#ff5a1f]/20 text-[#ff5a1f] border border-[#ff5a1f]/30"
                            : selectedMessage.status === "read"
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            : selectedMessage.status === "replied"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {selectedMessage.status}
                      </span>

                      <span className="text-xs font-mono text-[#737373]">
                        ID: {selectedMessage.id}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#a3a3a3] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#737373]" />
                      {formatAdminDateWithZone(selectedMessage.created_at)}
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {selectedMessage.subject}
                  </h2>

                  <div className="rounded-xl border border-white/5 bg-[#0c0d0e]/60 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-[#ededed]">
                      <span className="text-xs font-mono text-[#737373] w-14">From:</span>
                      <span className="font-semibold text-white">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#ededed]">
                      <span className="text-xs font-mono text-[#737373] w-14">Email:</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#ff5a1f] hover:underline font-mono text-xs flex items-center gap-1"
                      >
                        {selectedMessage.email}
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
                      <span className="font-mono text-[#737373] w-14">Storage:</span>
                      <span className="font-mono">
                        {selectedMessage.email_notification_sent
                          ? "Dispatched to Resend & Persisted to PostgreSQL"
                          : "Safely Stored in PostgreSQL"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#737373] mb-3">
                    Message Content
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#0c0d0e] p-5 sm:p-6 text-sm text-[#ededed] whitespace-pre-wrap leading-relaxed font-sans select-text">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#737373]">
                    Quick Actions
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {/* Direct Mailto Reply Button */}
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}&body=%0A%0A--- Original Inquiry ---%0AFrom: ${encodeURIComponent(
                        selectedMessage.name
                      )}%0ADate: ${encodeURIComponent(
                        formatDate(selectedMessage.created_at)
                      )}%0A%0A${encodeURIComponent(selectedMessage.message)}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5a1f] hover:bg-[#e04e18] text-xs font-semibold text-white shadow-lg shadow-[#ff5a1f]/20 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {/* Mark as Read */}
                    {selectedMessage.status !== "read" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, "read")}
                        disabled={updatingId === selectedMessage.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-sky-300 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    {/* Mark as Replied */}
                    {selectedMessage.status !== "replied" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, "replied")}
                        disabled={updatingId === selectedMessage.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium text-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Replied</span>
                      </button>
                    )}

                    {/* Archive */}
                    {selectedMessage.status !== "archived" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, "archived")}
                        disabled={updatingId === selectedMessage.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-medium text-purple-300 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>
                    )}

                    {/* Mark as New */}
                    {selectedMessage.status !== "new" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, "new")}
                        disabled={updatingId === selectedMessage.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-[#a3a3a3] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark as New</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
