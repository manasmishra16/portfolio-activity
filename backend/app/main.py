from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import github, projects, contact, health, notes, resume, stats

app = FastAPI(
    title="Manas Mishra — Portfolio Backend API",
    description="Full-stack REST API service providing GitHub telemetry, project dossiers, technical notes, resume metadata, and contact workflows for Manas Mishra's portfolio.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Comprehensive CORS Middleware allowing Next.js frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://manasmishra.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
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
