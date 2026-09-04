"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  GitBranch,
  Star,
  ExternalLink,
  Terminal,
  RefreshCw,
  AlertCircle,
  GitCommit,
  GitPullRequest,
  Clock,
  Layers,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { soundManager } from "@/lib/audio";

import { apiClient, GitHubProfileData, GitHubRepoData, GitHubActivityData } from "@/lib/api-client";

export const GitHubSection: React.FC = () => {
  const [profile, setProfile] = useState<GitHubProfileData | null>(null);
  const [repos, setRepos] = useState<GitHubRepoData[]>([]);
  const [activity, setActivity] = useState<GitHubActivityData[]>([]);
  const [activeTab, setActiveTab] = useState<"repos" | "activity">("repos");
  const [activeLang, setActiveLang] = useState<string>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceStatus, setSourceStatus] = useState<string>("connecting");

  const fetchGitHubTelemetry = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, reposRes, activityRes] = await Promise.all([
        apiClient.getGitHubProfile(),
        apiClient.getGitHubRepos(),
        apiClient.getGitHubActivity(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (reposRes.data) setRepos(reposRes.data);
      if (activityRes.data) setActivity(activityRes.data);

      setSourceStatus(profileRes.source === "live" ? "Live Sync" : "Cached Sync");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving GitHub telemetry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubTelemetry();
  }, [fetchGitHubTelemetry]);

  const languages = useMemo(
    () => ["All", ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))],
    [repos]
  );

  const filteredRepos = useMemo(
    () => (activeLang === "All" ? repos : repos.filter((r) => r.language === activeLang)),
    [activeLang, repos]
  );

  return (
    <section
      id="github"
      className="relative py-16 border-t border-[#1f222a]"
    >
      {/* Header with identity & refresh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
            <span className="font-mono text-xs text-[#9aa2b5] tracking-[0.25em] uppercase font-semibold">
              AUTHENTICATED TELEMETRY // GITHUB REPOSITORIES
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-[-0.02em]">
            Code &amp; Activity
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <a
            href="https://github.com/manasmishra16"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => soundManager.playHover()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#272a31] bg-[#121417] hover:border-[#ff5a1f] text-xs font-mono text-white transition-colors"
          >
            <GitHubIcon className="w-3.5 h-3.5 text-[#ff5a1f]" />
            <span>@manasmishra16</span>
            <ExternalLink className="w-3 h-3 text-[#6e7481]" />
          </a>

          {/* Refresh / Retry Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              fetchGitHubTelemetry();
            }}
            disabled={loading}
            onMouseEnter={() => soundManager.playHover()}
            title="Refresh telemetry cache from server"
            className="w-9 h-9 rounded-full border border-[#272a31] bg-[#121417] hover:border-[#ff5a1f] text-[#8e94a0] hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#ff5a1f]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ERROR STATE: With Retry Action */}
      {error && !loading && (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-3 text-red-400 font-mono text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              fetchGitHubTelemetry();
            }}
            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs border border-red-500/40 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Profile Telemetry Overview Card */}
      {profile && (
        <div className="p-6 sm:p-8 rounded-2xl border border-[#20232a] bg-[#111317] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border-2 border-[#ff5a1f] overflow-hidden bg-[#1a1c22] flex-shrink-0 shadow-[0_0_15px_rgba(255,90,31,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url || "https://avatars.githubusercontent.com/u/227104903?v=4"}
                alt="Manas Mishra GitHub Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  {profile.name || "Manas Mishra"}
                </h3>
                <span className="font-mono text-xs text-[#ff5a1f] font-semibold">
                  @{profile.login}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#878e9c] font-sans mt-1 max-w-lg leading-relaxed">
                {profile.bio || "Computer Science Engineer | Building intelligent data & ML systems."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10 font-mono text-xs border-t md:border-t-0 md:border-l border-[#1f2228] pt-4 md:pt-0 md:pl-8 text-[#8e94a0]">
            <div>
              <span className="text-[#555a64] block text-[10px] uppercase tracking-wider">
                PUBLIC REPOS
              </span>
              <span className="text-white font-bold text-lg font-heading">
                {profile.public_repos}
              </span>
            </div>
            <div>
              <span className="text-[#555a64] block text-[10px] uppercase tracking-wider">
                LOCATION
              </span>
              <span className="text-white font-medium">Bengaluru, IN</span>
            </div>
            <div>
              <span className="text-[#555a64] block text-[10px] uppercase tracking-wider">
                API TELEMETRY
              </span>
              <span className="text-[#00ff88] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                {sourceStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Row: Repositories vs Activity Timeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 p-1 rounded-full border border-[#20232a] bg-[#0e1013] w-fit">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("repos");
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              activeTab === "repos"
                ? "bg-[#ff5a1f] text-white font-semibold shadow-[0_0_12px_rgba(255,90,31,0.35)]"
                : "text-[#878e9c] hover:text-white"
            }`}
          >
            REPOSITORIES ({repos.length})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("activity");
            }}
            onMouseEnter={() => soundManager.playHover()}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              activeTab === "activity"
                ? "bg-[#ff5a1f] text-white font-semibold shadow-[0_0_12px_rgba(255,90,31,0.35)]"
                : "text-[#878e9c] hover:text-white"
            }`}
          >
            RECENT COMMITS &amp; EVENTS ({activity.length})
          </button>
        </div>

        {/* Language Filter Pills (only when in Repos tab) */}
        {activeTab === "repos" && (
          <div className="flex flex-wrap items-center gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  soundManager.playClick();
                  setActiveLang(lang);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                  activeLang === lang
                    ? "border border-[#ff5a1f] bg-[#ff5a1f]/15 text-[#ff5a1f] font-semibold"
                    : "border border-[#1f2228] bg-[#101215] text-[#717684] hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LOADING SKELETON STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#1f2228] bg-[#101215] animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 bg-[#1f2228] rounded" />
                <div className="w-12 h-3 bg-[#1f2228] rounded" />
              </div>
              <div className="w-3/4 h-6 bg-[#1f2228] rounded" />
              <div className="w-full h-12 bg-[#17191e] rounded" />
              <div className="w-1/2 h-3 bg-[#1f2228] rounded pt-2" />
            </div>
          ))}
        </div>
      )}

      {/* TAB 1: REPOSITORIES GRID */}
      {!loading && activeTab === "repos" && (
        <>
          {/* EMPTY STATE */}
          {filteredRepos.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-[#23262c] rounded-2xl p-8">
              <Layers className="w-8 h-8 text-[#555a64] mx-auto mb-3" />
              <p className="font-mono text-sm text-[#878e9c]">
                No repositories found matching language &ldquo;{activeLang}&rdquo;.
              </p>
              <button
                onClick={() => setActiveLang("All")}
                className="mt-3 text-xs font-mono text-[#ff5a1f] hover:underline"
              >
                Reset language filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <article
                  key={repo.id || repo.name}
                  onMouseEnter={() => soundManager.playHover()}
                  className="p-6 rounded-2xl border border-[#1f2228] bg-[#111317] hover:border-[#ff5a1f]/40 transition-all flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#16181e] border border-[#23262c] text-[#ff5a1f] font-semibold">
                        {repo.language || "Code"}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-mono text-[#626775]">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#ffbd2e]" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5" /> {repo.forks}
                        </span>
                      </div>
                    </div>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-heading font-bold text-xl text-white group-hover:text-[#ff5a1f] transition-colors flex items-center gap-1.5 mb-2.5"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>

                    <p className="text-xs text-[#878e9c] line-clamp-3 leading-relaxed mb-4 font-sans">
                      {repo.description}
                    </p>

                    {/* Topics badges if available */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded bg-[#15171d] border border-[#1f2228] font-mono text-[10px] text-[#6e7482]"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#1b1d22] flex items-center justify-between text-[11px] font-mono text-[#5b606c]">
                    <span>
                      {repo.updatedAt
                        ? `Updated ${new Date(repo.updatedAt).toLocaleDateString()}`
                        : "Active"}
                    </span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ff5a1f] hover:underline"
                    >
                      Inspect Repo →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: LIVE ACTIVITY & COMMIT EVENTS */}
      {!loading && activeTab === "activity" && (
        <div className="p-6 sm:p-8 rounded-2xl border border-[#1f2228] bg-[#111317]">
          <div className="divide-y divide-[#1b1d22]">
            {activity.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-[#717684]">
                No public activity events found.
              </div>
            ) : (
              activity.map((act) => (
                <div key={act.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#181a20] border border-[#23262c] flex items-center justify-center text-[#ff5a1f] flex-shrink-0 mt-0.5">
                      {act.type === "PushEvent" ? (
                        <GitCommit className="w-4 h-4" />
                      ) : (
                        <GitPullRequest className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-[#ff5a1f] uppercase font-semibold">
                          {act.action}
                        </span>
                        <span className="text-xs text-[#555a64] font-mono">on</span>
                        <a
                          href={act.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-white hover:underline font-medium"
                        >
                          {act.repoName}
                        </a>
                      </div>

                      {act.commits && act.commits.length > 0 ? (
                        act.commitUrl ? (
                          <a
                            href={act.commitUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs sm:text-sm text-[#cbd0dc] hover:text-[#ff5a1f] font-sans transition-colors block"
                          >
                            {act.commits[0]}
                          </a>
                        ) : (
                          <p className="text-xs sm:text-sm text-[#cbd0dc] font-sans">
                            {act.commits[0]}
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-[#717684] font-sans">
                          Automated repository event recorded.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#555a64] flex-shrink-0 sm:self-center">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};
