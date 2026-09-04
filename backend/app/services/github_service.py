import os
import time
from typing import Dict, Any, List, Optional
import urllib.request
import urllib.error
import json

class GitHubService:
    """
    Production-grade backend service responsible for GitHub integration.
    Features:
    - Server-side GitHub API communication
    - Secure token ingestion from environment variable (never exposed to client)
    - In-memory TTL caching and rate-limit mitigation
    - Real profile, repository metadata, and recent commit/activity ingestion
    - Graceful offline/rate-limit fallback using verified repository data
    """
    def __init__(self):
        self.username = os.getenv("GITHUB_USERNAME", "manasmishra16")
        self.token = os.getenv("GITHUB_TOKEN")
        self.cache_ttl = 600.0  # 10 minutes cache window

        self._profile_cache: Optional[Dict[str, Any]] = None
        self._repos_cache: Optional[List[Dict[str, Any]]] = None
        self._activity_cache: Optional[List[Dict[str, Any]]] = None

        self._last_profile_time = 0.0
        self._last_repos_time = 0.0
        self._last_activity_time = 0.0

    def get_headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Manas-Mishra-Portfolio-Backend/2.0",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _fetch_json(self, url: str) -> Any:
        req = urllib.request.Request(url, headers=self.get_headers())
        with urllib.request.urlopen(req, timeout=6) as response:
            return json.loads(response.read().decode())

    def get_profile(self) -> Dict[str, Any]:
        now = time.time()
        if self._profile_cache and (now - self._last_profile_time < self.cache_ttl):
            return {"data": self._profile_cache, "source": "cache", "cachedAt": self._last_profile_time}

        url = f"https://api.github.com/users/{self.username}"
        try:
            raw = self._fetch_json(url)
            profile_data = {
                "login": raw.get("login", self.username),
                "name": raw.get("name") or "Manas Mishra",
                "avatar_url": raw.get("avatar_url"),
                "html_url": raw.get("html_url"),
                "bio": raw.get("bio") or "Computer Science Engineer | KSIT Bengaluru '27 | Machine Learning & Full-Stack Systems",
                "public_repos": raw.get("public_repos", 6),
                "followers": raw.get("followers", 0),
                "following": raw.get("following", 0),
                "location": raw.get("location") or "Bengaluru, India",
                "created_at": raw.get("created_at"),
                "updated_at": raw.get("updated_at"),
            }
            self._profile_cache = profile_data
            self._last_profile_time = now
            return {"data": profile_data, "source": "live"}
        except Exception as e:
            fallback = {
                "login": self.username,
                "name": "Manas Mishra",
                "avatar_url": "https://avatars.githubusercontent.com/u/227104903?v=4",
                "html_url": f"https://github.com/{self.username}",
                "bio": "Computer Science Engineer | Building intelligent data & machine learning applications.",
                "public_repos": 6,
                "followers": 1,
                "following": 1,
                "location": "Bengaluru, India",
                "created_at": "2025-08-18T05:29:06Z",
                "updated_at": "2026-08-26T23:18:13Z"
            }
            return {"data": fallback, "source": "fallback", "error": str(e)}

    def get_repos(self) -> Dict[str, Any]:
        now = time.time()
        if self._repos_cache and (now - self._last_repos_time < self.cache_ttl):
            return {"data": self._repos_cache, "source": "cache", "cachedAt": self._last_repos_time}

        url = f"https://api.github.com/users/{self.username}/repos?sort=updated&per_page=30"
        try:
            raw = self._fetch_json(url)
            repos_data = []
            for r in raw:
                # Exclude forks if desired or keep all public repos
                repos_data.append({
                    "id": r.get("id"),
                    "name": r.get("name"),
                    "fullName": r.get("full_name"),
                    "url": r.get("html_url"),
                    "description": r.get("description") or f"Public engineering repository by {self.username}",
                    "stars": r.get("stargazers_count", 0),
                    "forks": r.get("forks_count", 0),
                    "language": r.get("language") or "Code",
                    "updatedAt": r.get("updated_at"),
                    "createdAt": r.get("created_at"),
                    "homepage": r.get("homepage"),
                    "topics": r.get("topics", []),
                    "defaultBranch": r.get("default_branch", "main"),
                })

            self._repos_cache = repos_data
            self._last_repos_time = now
            return {"data": repos_data, "source": "live"}
        except Exception as e:
            fallback = [
                {
                    "id": 101,
                    "name": "Heart-disease-prediction",
                    "fullName": f"{self.username}/Heart-disease-prediction",
                    "url": f"https://github.com/{self.username}/Heart-disease-prediction",
                    "description": "Deep learning clinical risk classification pipeline combining 1D-CNN spatial filters with bidirectional LSTM recurrent layers.",
                    "stars": 0,
                    "forks": 0,
                    "language": "Python",
                    "updatedAt": "2026-08-31T20:02:08Z",
                    "topics": ["deep-learning", "tensorflow", "lstm", "cnn", "flask"],
                },
                {
                    "id": 102,
                    "name": "mango-frontend",
                    "fullName": f"{self.username}/mango-frontend",
                    "url": f"https://github.com/{self.username}/mango-frontend",
                    "description": "Automated crop pathology diagnosis frontend interface with real-time confidence scores and dataset telemetry.",
                    "stars": 0,
                    "forks": 0,
                    "language": "TypeScript",
                    "updatedAt": "2026-08-25T14:10:00Z",
                    "homepage": "https://mango-frontend-flax.vercel.app",
                    "topics": ["react", "typescript", "automl", "scikit-learn"],
                },
                {
                    "id": 103,
                    "name": "pg-hostel-allocation-system",
                    "fullName": f"{self.username}/pg-hostel-allocation-system",
                    "url": f"https://github.com/{self.username}/pg-hostel-allocation-system",
                    "description": "Full-stack institutional accommodation reservation system using React, Supabase, and PostgreSQL PLpgSQL constraints.",
                    "stars": 0,
                    "forks": 0,
                    "language": "PLpgSQL",
                    "updatedAt": "2026-08-20T11:45:00Z",
                    "topics": ["postgresql", "supabase", "react", "plpgsql"],
                },
                {
                    "id": 104,
                    "name": "portfolio",
                    "fullName": f"{self.username}/portfolio",
                    "url": f"https://github.com/{self.username}/portfolio",
                    "description": "Zero-gravity 3D spatial engineering portfolio built with Next.js 16, React 19, Three.js, and Web Audio API.",
                    "stars": 0,
                    "forks": 0,
                    "language": "TypeScript",
                    "updatedAt": "2026-09-04T00:00:00Z",
                    "topics": ["threejs", "nextjs", "react-three-fiber", "webgl"],
                },
                {
                    "id": 105,
                    "name": "java-activity",
                    "fullName": f"{self.username}/java-activity",
                    "url": f"https://github.com/{self.username}/java-activity",
                    "description": "Object-oriented programming implementations, algorithms, and design pattern exercises in Java.",
                    "stars": 0,
                    "forks": 0,
                    "language": "Java",
                    "updatedAt": "2026-08-15T09:30:00Z",
                    "topics": ["java", "algorithms", "oops"],
                },
                {
                    "id": 106,
                    "name": "Complete-Langchain-Tutorials",
                    "fullName": f"{self.username}/Complete-Langchain-Tutorials",
                    "url": f"https://github.com/{self.username}/Complete-Langchain-Tutorials",
                    "description": "Comprehensive tutorial implementations of LLM chains, retrieval-augmented generation (RAG), and agent workflows.",
                    "stars": 0,
                    "forks": 0,
                    "language": "Python",
                    "updatedAt": "2026-08-12T16:00:00Z",
                    "topics": ["langchain", "llm", "rag", "python"],
                }
            ]
            return {"data": fallback, "source": "fallback", "error": str(e)}

    def get_activity(self) -> Dict[str, Any]:
        now = time.time()
        if self._activity_cache and (now - self._last_activity_time < self.cache_ttl):
            return {"data": self._activity_cache, "source": "cache", "cachedAt": self._last_activity_time}

        url = f"https://api.github.com/users/{self.username}/events/public?per_page=15"
        try:
            raw = self._fetch_json(url)
            activities = []
            for event in raw:
                e_type = event.get("type", "Event")
                repo = event.get("repo", {})
                payload = event.get("payload", {})
                commits = payload.get("commits", [])

                commit_messages = [c.get("message") for c in commits if c.get("message")]

                activities.append({
                    "id": event.get("id"),
                    "type": e_type,
                    "repoName": repo.get("name"),
                    "repoUrl": f"https://github.com/{repo.get('name')}",
                    "createdAt": event.get("created_at"),
                    "commitCount": len(commits),
                    "commits": commit_messages[:3],
                    "action": payload.get("action") or e_type.replace("Event", "").lower(),
                })

            self._activity_cache = activities
            self._last_activity_time = now
            return {"data": activities, "source": "live"}
        except Exception as e:
            fallback = [
                {
                    "id": "act_1",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/Heart-disease-prediction",
                    "repoUrl": f"https://github.com/{self.username}/Heart-disease-prediction",
                    "createdAt": "2026-08-31T19:48:47Z",
                    "commitCount": 1,
                    "commits": ["Update model training pipeline and ECG feature preprocessing"],
                    "action": "push",
                },
                {
                    "id": "act_2",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/portfolio",
                    "repoUrl": f"https://github.com/{self.username}/portfolio",
                    "createdAt": "2026-08-26T23:18:13Z",
                    "commitCount": 2,
                    "commits": ["Initialize zero-gravity 3D spatial canvas and full-stack API"],
                    "action": "push",
                },
                {
                    "id": "act_3",
                    "type": "CreateEvent",
                    "repoName": f"{self.username}/mango-frontend",
                    "repoUrl": f"https://github.com/{self.username}/mango-frontend",
                    "createdAt": "2026-08-25T14:10:00Z",
                    "commitCount": 0,
                    "commits": [],
                    "action": "create",
                }
            ]
            return {"data": fallback, "source": "fallback", "error": str(e)}

github_service = GitHubService()
