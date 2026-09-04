import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";

let cachedActivity: unknown = null;
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

interface RawGitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    commits?: { sha: string; message: string; url: string }[];
    ref_type?: string;
    description?: string;
  };
}

export async function GET() {
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
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=15`,
      {
        headers,
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub events API responded with status ${res.status}`);
    }

    const raw = (await res.json()) as RawGitHubEvent[];

    const formatted = raw.map((event) => {
      const commits = event.payload?.commits || [];
      const messages = commits.map((c) => c.message).filter(Boolean);

      return {
        id: event.id,
        type: event.type,
        repoName: event.repo?.name || "Repository",
        repoUrl: `https://github.com/${event.repo?.name}`,
        createdAt: event.created_at,
        commitCount: commits.length,
        commits: messages.slice(0, 3),
        action: event.payload?.action || event.type.replace("Event", "").toLowerCase(),
      };
    });

    cachedActivity = formatted;
    cacheTime = now;

    return NextResponse.json({ data: formatted, source: "live" });
  } catch (error) {
    console.warn("GitHub events API error, returning fallback activity:", error);

    const fallbackActivity = [
      {
        id: "act_1",
        type: "PushEvent",
        repoName: `${username}/Heart-disease-prediction`,
        repoUrl: `https://github.com/${username}/Heart-disease-prediction`,
        createdAt: "2026-08-31T19:48:47Z",
        commitCount: 1,
        commits: ["Refactor hybrid CNN-LSTM pipeline and add evaluation benchmarks"],
        action: "push",
      },
      {
        id: "act_2",
        type: "PushEvent",
        repoName: `${username}/portfolio`,
        repoUrl: `https://github.com/${username}/portfolio`,
        createdAt: "2026-08-26T23:18:13Z",
        commitCount: 2,
        commits: ["Build zero-gravity 3D spatial canvas and full-stack API"],
        action: "push",
      },
      {
        id: "act_3",
        type: "CreateEvent",
        repoName: `${username}/mango-frontend`,
        repoUrl: `https://github.com/${username}/mango-frontend`,
        createdAt: "2026-08-25T14:10:00Z",
        commitCount: 0,
        commits: [],
        action: "create",
      },
    ];

    return NextResponse.json({ data: fallbackActivity, source: "fallback" });
  }
}
