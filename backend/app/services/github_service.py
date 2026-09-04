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
        self.cache_ttl = 300.0  # 5 minutes for general profile/repos
        self.activity_cache_ttl = 90.0  # 90 seconds for fresh recent commits without rate-limit risk

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
        if self._activity_cache and (now - self._last_activity_time < self.activity_cache_ttl):
            return {"data": self._activity_cache, "source": "cache", "cachedAt": self._last_activity_time}

        activities: List[Dict[str, Any]] = []

        try:
            # 1. Fetch user repositories sorted by recent push events
            url_repos = f"https://api.github.com/users/{self.username}/repos?sort=pushed&per_page=6"
            repos_raw = self._fetch_json(url_repos)

            # 2. Iterate through recently pushed repositories to collect actual commits
            if isinstance(repos_raw, list):
                for repo in repos_raw[:5]:
                    repo_name = repo.get("name")
                    if not repo_name:
                        continue

                    repo_full_name = repo.get("full_name") or f"{self.username}/{repo_name}"
                    repo_html_url = repo.get("html_url") or f"https://github.com/{self.username}/{repo_name}"

                    try:
                        url_commits = f"https://api.github.com/repos/{self.username}/{repo_name}/commits?per_page=5"
                        commits_raw = self._fetch_json(url_commits)
                        if isinstance(commits_raw, list):
                            for c in commits_raw:
                                c_detail = c.get("commit", {})
                                c_author = c_detail.get("author", {})
                                c_committer = c_detail.get("committer", {})
                                commit_date = c_author.get("date") or c_committer.get("date") or repo.get("pushed_at")
                                full_msg = c_detail.get("message", "Update repository")
                                short_msg = full_msg.strip().split("\n")[0] if full_msg else "Update repository"
                                sha_id = c.get("sha", "")

                                activities.append({
                                    "id": sha_id[:7] if sha_id else f"commit_{len(activities)}",
                                    "type": "PushEvent",
                                    "repoName": repo_full_name,
                                    "repoUrl": repo_html_url,
                                    "commitUrl": c.get("html_url") or f"{repo_html_url}/commit/{sha_id}",
                                    "createdAt": commit_date,
                                    "commitCount": 1,
                                    "commits": [short_msg],
                                    "action": "commit",
                                })
                    except Exception:
                        continue

            # 3. Sort all commits strictly newest-first
            activities.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)

            # 4. If actual commits were collected, store and return top results
            if activities:
                top_activities = activities[:15]
                self._activity_cache = top_activities
                self._last_activity_time = now
                return {"data": top_activities, "source": "live"}

            # Fallback to public events feed if commit traversal returned empty
            url_events = f"https://api.github.com/users/{self.username}/events/public?per_page=15"
            raw_events = self._fetch_json(url_events)
            for event in (raw_events if isinstance(raw_events, list) else []):
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
                    "commitUrl": f"https://github.com/{repo.get('name')}",
                    "createdAt": event.get("created_at"),
                    "commitCount": len(commits),
                    "commits": commit_messages[:3],
                    "action": payload.get("action") or e_type.replace("Event", "").lower(),
                })

            if activities:
                activities.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)
                top_activities = activities[:15]
                self._activity_cache = top_activities
                self._last_activity_time = now
                return {"data": top_activities, "source": "live"}

            raise ValueError("No live commits or events retrieved")

        except Exception as e:
            fallback = [
                {
                    "id": "25f392c",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/portfolio-activity",
                    "repoUrl": f"https://github.com/{self.username}/portfolio-activity",
                    "commitUrl": f"https://github.com/{self.username}/portfolio-activity/commit/25f392c",
                    "createdAt": "2026-09-04T19:12:18Z",
                    "commitCount": 1,
                    "commits": ["feat: complete portfolio with live GitHub integration and dual theme system"],
                    "action": "commit",
                },
                {
                    "id": "60326e7",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/portfolio-activity",
                    "repoUrl": f"https://github.com/{self.username}/portfolio-activity",
                    "commitUrl": f"https://github.com/{self.username}/portfolio-activity/commit/60326e7",
                    "createdAt": "2026-09-03T18:15:52Z",
                    "commitCount": 1,
                    "commits": ["Initial commit from Create Next App"],
                    "action": "commit",
                },
                {
                    "id": "act_1",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/Heart-disease-prediction",
                    "repoUrl": f"https://github.com/{self.username}/Heart-disease-prediction",
                    "commitUrl": f"https://github.com/{self.username}/Heart-disease-prediction",
                    "createdAt": "2026-08-31T19:48:47Z",
                    "commitCount": 1,
                    "commits": ["Update model training pipeline and ECG feature preprocessing"],
                    "action": "commit",
                },
                {
                    "id": "act_2",
                    "type": "PushEvent",
                    "repoName": f"{self.username}/portfolio",
                    "repoUrl": f"https://github.com/{self.username}/portfolio",
                    "commitUrl": f"https://github.com/{self.username}/portfolio",
                    "createdAt": "2026-08-31T19:51:06Z",
                    "commitCount": 1,
                    "commits": ["chore: add local run script and graphify project output"],
                    "action": "commit",
                },
                {
                    "id": "act_3",
                    "type": "CreateEvent",
                    "repoName": f"{self.username}/mango-frontend",
                    "repoUrl": f"https://github.com/{self.username}/mango-frontend",
                    "commitUrl": f"https://github.com/{self.username}/mango-frontend",
                    "createdAt": "2026-05-30T14:39:34Z",
                    "commitCount": 0,
                    "commits": [],
                    "action": "create",
                }
            ]
            return {"data": fallback, "source": "fallback", "error": str(e)}

github_service = GitHubService()
