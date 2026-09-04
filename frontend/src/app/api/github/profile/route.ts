import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";

// Simple in-memory cache to stay well within GitHub API rate limits
let cachedProfile: unknown = null;
let cacheTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  const now = Date.now();

  if (cachedProfile && now - cacheTime < CACHE_TTL_MS) {
    return NextResponse.json({ data: cachedProfile, source: "cache" });
  }

  const username = process.env.GITHUB_USERNAME || SITE_CONFIG.handle;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Manas-Mishra-Portfolio-Server",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 900 }, // Next.js ISR 15 mins
    });

    if (!res.ok) {
      throw new Error(`GitHub API responded with status ${res.status}`);
    }

    const data = await res.json();
    cachedProfile = data;
    cacheTime = now;

    return NextResponse.json({ data, source: "live" });
  } catch (error) {
    console.warn("GitHub API error, using verified profile fallback:", error);

    // Reliable fallback matching real GitHub data
    const fallbackData = {
      login: username,
      name: "Manas Mishra",
      avatar_url: "https://avatars.githubusercontent.com/u/227104903?v=4",
      html_url: `https://github.com/${username}`,
      bio: "Computer Science Engineer | Building intelligent data & machine learning applications.",
      public_repos: 6,
      followers: 1,
      following: 1,
      location: "Bengaluru, India",
    };

    return NextResponse.json({ data: fallbackData, source: "fallback" });
  }
}
