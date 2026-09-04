import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";

let cachedRepos: unknown = null;
let cacheTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cachedRepos && now - cacheTime < CACHE_TTL_MS) {
    return NextResponse.json({ data: cachedRepos, source: "cache" });
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
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers,
        next: { revalidate: 900 },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub repos API responded with status ${res.status}`);
    }

    interface RawRepo {
      id: number;
      name: string;
      full_name: string;
      html_url: string;
      description: string | null;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      updated_at: string;
      topics?: string[];
      homepage?: string | null;
    }

    const raw = (await res.json()) as RawRepo[];
    const formatted = raw.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      url: r.html_url,
      description: r.description || "Public repository authored by Manas Mishra.",
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language || "Code",
      updatedAt: r.updated_at,
      topics: r.topics || [],
      homepage: r.homepage || null,
    }));

    cachedRepos = formatted;
    cacheTime = now;

    return NextResponse.json({ data: formatted, source: "live" });
  } catch (error) {
    console.warn("GitHub repos error, returning verified real repository set:", error);

    // Fallback matching real GitHub repositories for manasmishra16
    const fallbackRepos = [
      {
        id: 1330113110,
        name: "Heart-disease-prediction",
        fullName: "manasmishra16/Heart-disease-prediction",
        url: "https://github.com/manasmishra16/Heart-disease-prediction",
        description: "Heart disease prediction project using machine learning and deep learning.",
        stars: 0,
        forks: 0,
        language: "Python",
        updatedAt: "2026-08-31T20:02:08Z",
        topics: ["machine-learning", "deep-learning", "flask", "tensorflow"],
        homepage: null,
      },
      {
        id: 1351945440,
        name: "portfolio",
        fullName: "manasmishra16/portfolio",
        url: "https://github.com/manasmishra16/portfolio",
        description: "Zero-gravity 3D spatial developer portfolio built with Next.js, Three.js, and Web Audio.",
        stars: 0,
        forks: 0,
        language: "TypeScript",
        updatedAt: "2026-08-31T19:54:06Z",
        topics: ["threejs", "nextjs", "react-three-fiber", "webgl"],
        homepage: "http://localhost:3001",
      },
      {
        id: 1254305596,
        name: "mango-frontend",
        fullName: "manasmishra16/mango-frontend",
        url: "https://github.com/manasmishra16/mango-frontend",
        description: "Mango disease prediction frontend client interface.",
        stars: 0,
        forks: 0,
        language: "TypeScript",
        updatedAt: "2026-05-30T14:39:38Z",
        topics: ["react", "typescript", "disease-prediction"],
        homepage: "https://mango-frontend-flax.vercel.app",
      },
      {
        id: 1224513023,
        name: "pg-hostel-allocation-system",
        fullName: "manasmishra16/pg-hostel-allocation-system",
        url: "https://github.com/manasmishra16/pg-hostel-allocation-system",
        description: "Full-stack PG and Hostel Room Allocation & Complaint Management System using React, Supabase, and PostgreSQL.",
        stars: 0,
        forks: 0,
        language: "PLpgSQL",
        updatedAt: "2026-04-29T11:05:02Z",
        topics: ["supabase", "postgresql", "react"],
        homepage: null,
      },
      {
        id: 1203994858,
        name: "java-activity",
        fullName: "manasmishra16/java-activity",
        url: "https://github.com/manasmishra16/java-activity",
        description: "Java Object-Oriented Programming and algorithm problem implementations.",
        stars: 0,
        forks: 0,
        language: "Java",
        updatedAt: "2026-04-07T15:33:57Z",
        topics: ["java", "algorithms", "oops"],
        homepage: null,
      },
      {
        id: 1045239921,
        name: "Complete-Langchain-Tutorials",
        fullName: "manasmishra16/Complete-Langchain-Tutorials",
        url: "https://github.com/manasmishra16/Complete-Langchain-Tutorials",
        description: "Comprehensive tutorial implementations of LLM chains, retrieval-augmented generation (RAG), and agent workflows.",
        stars: 0,
        forks: 0,
        language: "Python",
        updatedAt: "2025-08-19T08:47:21Z",
        topics: ["langchain", "llm", "rag", "python"],
        homepage: null,
      },
    ];

    return NextResponse.json({ data: fallbackRepos, source: "fallback" });
  }
}
