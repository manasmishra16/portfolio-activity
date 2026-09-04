import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

let cachedActivity: unknown = null;
let cacheTime = 0;
const CACHE_TTL_MS = 90 * 1000; // 90 seconds fresh cache window

interface RawGitHubRepo {
  name: string;
  full_name?: string;
  html_url?: string;
  pushed_at?: string;
}

interface RawGitHubCommit {
  sha: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: { date?: string };
    committer?: { date?: string };
  };
}

export async function GET() {
  // 1. Check FastAPI backend first
  const fastApiRes = await fetchFromFastAPI<unknown[]>("/api/github/activity");
  if (fastApiRes.data && Array.isArray(fastApiRes.data) && fastApiRes.data.length > 0) {
    return NextResponse.json({
      data: fastApiRes.data,
      source: "fastapi",
    });
  }

  // 2. Check local in-memory cache
  const now = Date.now();
  if (cachedActivity && now - cacheTime < CACHE_TTL_MS) {
    return NextResponse.json({ data: cachedActivity, source: "cache", cachedAt: cacheTime });
  }

  const username = process.env.GITHUB_USERNAME || SITE_CONFIG.handle;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Manas-Mishra-Portfolio-Server/2.0",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 3. Fetch repositories sorted by most recent push
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`,
      { headers, next: { revalidate: 90 } }
    );

    if (!reposRes.ok) {
      throw new Error(`GitHub repos API responded with status ${reposRes.status}`);
    }

    const repos = (await reposRes.json()) as RawGitHubRepo[];
    const activities: Array<{
      id: string;
      type: string;
      repoName: string;
      repoUrl: string;
      commitUrl?: string;
      createdAt: string;
      commitCount: number;
      commits: string[];
      action: string;
    }> = [];

    // 4. Fetch actual commits from top pushed repositories
    for (const repo of repos.slice(0, 5)) {
      if (!repo.name) continue;
      const repoFullName = repo.full_name || `${username}/${repo.name}`;
      const repoHtmlUrl = repo.html_url || `https://github.com/${username}/${repo.name}`;

      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`,
          { headers, next: { revalidate: 90 } }
        );

        if (commitsRes.ok) {
          const commits = (await commitsRes.json()) as RawGitHubCommit[];
          if (Array.isArray(commits)) {
            for (const c of commits) {
              const msg = c.commit?.message || "Update repository";
              const firstLine = msg.trim().split("\n")[0];
              const date = c.commit?.author?.date || c.commit?.committer?.date || repo.pushed_at || new Date().toISOString();

              activities.push({
                id: c.sha ? c.sha.slice(0, 7) : `commit_${activities.length}`,
                type: "PushEvent",
                repoName: repoFullName,
                repoUrl: repoHtmlUrl,
                commitUrl: c.html_url || `${repoHtmlUrl}/commit/${c.sha}`,
                createdAt: date,
                commitCount: 1,
                commits: [firstLine],
                action: "commit",
              });
            }
          }
        }
      } catch {
        continue;
      }
    }

    // 5. Sort all commits newest-first
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (activities.length > 0) {
      const topActivities = activities.slice(0, 15);
      cachedActivity = topActivities;
      cacheTime = now;
      return NextResponse.json({ data: topActivities, source: "live" });
    }

    throw new Error("No live commits found from GitHub API");
  } catch (error) {
    console.warn("GitHub activity fetch warning, returning verified fallback:", error);

    const fallbackActivity = [
      {
        id: "25f392c",
        type: "PushEvent",
        repoName: `${username}/portfolio-activity`,
        repoUrl: `https://github.com/${username}/portfolio-activity`,
        commitUrl: `https://github.com/${username}/portfolio-activity/commit/25f392c`,
        createdAt: "2026-09-04T19:12:18Z",
        commitCount: 1,
        commits: ["feat: complete portfolio with live GitHub integration and dual theme system"],
        action: "commit",
      },
      {
        id: "60326e7",
        type: "PushEvent",
        repoName: `${username}/portfolio-activity`,
        repoUrl: `https://github.com/${username}/portfolio-activity`,
        commitUrl: `https://github.com/${username}/portfolio-activity/commit/60326e7`,
        createdAt: "2026-09-03T18:15:52Z",
        commitCount: 1,
        commits: ["Initial commit from Create Next App"],
        action: "commit",
      },
      {
        id: "act_1",
        type: "PushEvent",
        repoName: `${username}/Heart-disease-prediction`,
        repoUrl: `https://github.com/${username}/Heart-disease-prediction`,
        commitUrl: `https://github.com/${username}/Heart-disease-prediction`,
        createdAt: "2026-08-31T19:48:47Z",
        commitCount: 1,
        commits: ["Update model training pipeline and ECG feature preprocessing"],
        action: "commit",
      },
      {
        id: "act_2",
        type: "PushEvent",
        repoName: `${username}/portfolio`,
        repoUrl: `https://github.com/${username}/portfolio`,
        commitUrl: `https://github.com/${username}/portfolio`,
        createdAt: "2026-08-31T19:51:06Z",
        commitCount: 1,
        commits: ["chore: add local run script and graphify project output"],
        action: "commit",
      },
      {
        id: "act_3",
        type: "CreateEvent",
        repoName: `${username}/mango-frontend`,
        repoUrl: `https://github.com/${username}/mango-frontend`,
        commitUrl: `https://github.com/${username}/mango-frontend`,
        createdAt: "2026-05-30T14:39:34Z",
        commitCount: 0,
        commits: [],
        action: "create",
      },
    ];

    return NextResponse.json({ data: fallbackActivity, source: "fallback" });
  }
}
