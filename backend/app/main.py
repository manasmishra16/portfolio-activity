import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api import github, projects, contact, health, notes, resume, stats
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe automatic database initialization on startup
    init_db()
    yield

app = FastAPI(
    title="Manas Mishra — Portfolio Backend API",
    description="Full-stack REST API service providing GitHub telemetry, project dossiers, technical notes, resume metadata, and contact workflows for Manas Mishra's portfolio.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Parse allowed origins from environment and defaults
default_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://manasmishra.dev",
    "https://www.manasmishra.dev",
]

env_origins = os.getenv("FRONTEND_ORIGINS", "")
if env_origins:
    extra_origins = [o.strip() for o in env_origins.split(",") if o.strip()]
    allowed_origins = list(set(default_origins + extra_origins))
else:
    allowed_origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Route registrations
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.get("/")
def root():
    return {
        "status": "online",
        "portfolio": "Manas Mishra",
        "positioning": "DATA → INTELLIGENCE → APPLICATION",
        "documentation": "/docs",
        "endpoints": [
            "/api/health",
            "/api/github/profile",
            "/api/github/repos",
            "/api/github/activity",
            "/api/projects",
            "/api/projects/{slug}",
            "/api/notes",
            "/api/notes/{slug}",
            "/api/resume",
            "/api/stats",
            "/api/contact"
        ]
    }
