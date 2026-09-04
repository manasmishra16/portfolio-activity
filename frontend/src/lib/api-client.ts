/**
 * Centralized, fully-typed API client for Manas Mishra's Portfolio.
 * Provides unified access to backend and telemetry endpoints.
 * Includes in-memory caching (5-minute TTL), in-flight deduplication,
 * and robust crash-proof fallback handling.
 */

import { ProjectItem, NoteItem, PROJECTS_DATA, NOTES_DATA } from "@/config/site";

export interface ApiResponse<T> {
  data: T;
  error?: string;
  source?: string;
  total?: number;
  cachedAt?: number;
  timestamp?: string;
}

export interface GitHubProfileData {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers?: number;
  following?: number;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface GitHubRepoData {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  topics: string[];
  homepage?: string | null;
  defaultBranch?: string;
}

export interface GitHubActivityData {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  commitUrl?: string;
  createdAt: string;
  commitCount: number;
  commits: string[];
  action: string;
}

export interface ResumeData {
  profile: {
    name: string;
    title: string;
    positioning: string;
    email: string;
    github: string;
    linkedin: string;
    location: string;
    summary: string;
  };
  education: {
    degree: string;
    institution: string;
    location: string;
    expectedGraduation: string;
    cgpa: string;
    currentSemester?: string;
    coursework?: string[];
  };
  skills: Record<string, unknown>;
  certifications: unknown[];
  projects: unknown[];
}

export interface PortfolioStatsData {
  cgpa: string;
  expectedGraduation: string;
  institution: string;
  publicRepos: number;
  coreProjects: number;
  verifiedCertifications: number;
  modelAccuracy: string;
  routesCompiled: number;
  fpsTarget: number;
  techStackPillars: string[];
  lastSynced: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponseData {
  success: boolean;
  message: string;
  reference_id?: string;
  timestamp?: string;
  error?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class PortfolioApiClient {
  private cache = new Map<string, { data: unknown; expiry: number }>();
  private inFlight = new Map<string, Promise<unknown>>();

  private async request<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<ApiResponse<T>> {
    const cacheKey = `${options?.method || "GET"}:${endpoint}`;

    // 1. Check in-memory cache
    if (!options || !options.method || options.method === "GET") {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return { data: cached.data as T, source: "memory_cache" };
      }

      // 2. Request deduplication for simultaneous in-flight calls
      if (this.inFlight.has(cacheKey)) {
        return this.inFlight.get(cacheKey) as Promise<ApiResponse<T>>;
      }
    }

    const fetchPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const res = await fetch(endpoint, {
          ...options,
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            ...(options?.headers || {}),
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorJson = await res.json().catch(() => ({}));
          throw new Error(errorJson.error || errorJson.detail || `HTTP ${res.status}`);
        }

        const json = await res.json();
        const responseData = (json.data !== undefined ? json.data : json) as T;

        // Cache successful response
        this.cache.set(cacheKey, { data: responseData, expiry: Date.now() + CACHE_TTL_MS });

        return { data: responseData, source: json.source || "network" } as ApiResponse<T>;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network unreachable";

        // Return fallback data if available to prevent UI crashes
        if (fallbackData !== undefined) {
          return { data: fallbackData, source: "offline_fallback", error: message };
        }

        throw new Error(message);
      } finally {
        this.inFlight.delete(cacheKey);
      }
    })();

    if (!options || !options.method || options.method === "GET") {
      this.inFlight.set(cacheKey, fetchPromise);
    }

    return fetchPromise;
  }

  // --- GITHUB TELEMETRY ---
  async getGitHubProfile(): Promise<ApiResponse<GitHubProfileData>> {
    return this.request<GitHubProfileData>("/api/github/profile", undefined, {
      login: "manasmishra16",
      name: "Manas Mishra",
      avatar_url: "https://github.com/manasmishra16.png",
      html_url: "https://github.com/manasmishra16",
      bio: "Computer Science Engineer | Machine Learning & Full-Stack Systems",
      public_repos: 6,
      followers: 1,
      location: "Bengaluru, India",
    });
  }

  async getGitHubRepos(): Promise<ApiResponse<GitHubRepoData[]>> {
    return this.request<GitHubRepoData[]>("/api/github/repos", undefined, []);
  }

  async getGitHubActivity(): Promise<ApiResponse<GitHubActivityData[]>> {
    return this.request<GitHubActivityData[]>("/api/github/activity", undefined, []);
  }

  // --- PROJECTS ---
  async getProjects(): Promise<ApiResponse<ProjectItem[]>> {
    return this.request<ProjectItem[]>("/api/projects", undefined, PROJECTS_DATA);
  }

  async getProjectBySlug(slug: string): Promise<ApiResponse<ProjectItem>> {
    const local = PROJECTS_DATA.find((p) => p.slug === slug);
    return this.request<ProjectItem>(`/api/projects/${slug}`, undefined, local);
  }

  // --- NOTES / PUBLICATIONS ---
  async getNotes(): Promise<ApiResponse<NoteItem[]>> {
    return this.request<NoteItem[]>("/api/notes", undefined, NOTES_DATA);
  }

  async getNoteBySlug(slug: string): Promise<ApiResponse<NoteItem>> {
    const local = NOTES_DATA.find((n) => n.slug === slug);
    return this.request<NoteItem>(`/api/notes/${slug}`, undefined, local);
  }

  // --- RESUME & METADATA ---
  async getResumeMetadata(): Promise<ApiResponse<ResumeData>> {
    return this.request<ResumeData>("/api/resume");
  }

  // --- PORTFOLIO STATS ---
  async getStats(): Promise<ApiResponse<PortfolioStatsData>> {
    return this.request<PortfolioStatsData>("/api/stats");
  }

  // --- CONTACT FORM ---
  async sendContactMessage(payload: ContactPayload): Promise<ContactResponseData> {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || json.message || "Failed to transmit message.");
    }
    return json as ContactResponseData;
  }
}

export const apiClient = new PortfolioApiClient();
