import type {
  ProjectItem,
  CertificationItem,
  AchievementItem,
  NoteItem,
  SITE_CONFIG,
} from "@/config/site";

export type { ProjectItem, CertificationItem, AchievementItem, NoteItem };
export type SiteConfig = typeof SITE_CONFIG;

export interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommitsYear: number;
  longestStreak: number;
  currentStreak: number;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
  topics: string[];
}

export interface GitHubActivityEvent {
  type: string;
  repo: string;
  date: string;
  message?: string;
  url?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  source: "fastapi" | "fallback";
  error?: string;
}
