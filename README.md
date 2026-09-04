# Manas Mishra — Full-Stack Developer Portfolio

> **DATA → INTELLIGENCE → APPLICATION**  
> High-performance, immersive portfolio engineering showcase blending deep machine learning, data infrastructure, and modern interactive 3D web experiences.

---

## Workspace Architecture

This repository is structured as a clean, decoupled full-stack monorepo:

```
portfolio/
├── frontend/                   # Next.js 16 App Router & 3D Interactive Web App
│   ├── public/                 # Static assets, SVG vector graphics, and icons
│   ├── src/
│   │   ├── app/                # App Router routes & API route handlers
│   │   │   ├── about/          # Philosophy, engineering principles & background
│   │   │   ├── achievements/   # Competitions, hackathons, and recognitions
│   │   │   ├── api/            # Route handlers (/api/github, /api/projects, etc.)
│   │   │   ├── certifications/ # Verified professional credentials
│   │   │   ├── contact/        # Direct outreach & communication channel
│   │   │   ├── experience/     # Industry & research career history
│   │   │   ├── notes/          # Deep-dive technical essays & articles
│   │   │   ├── projects/       # Detailed project dossiers & architecture specs
│   │   │   ├── resume/         # Interactive curriculum vitae
│   │   │   └── skills/         # Engineering competencies & toolchain
│   │   ├── components/
│   │   │   ├── canvas/         # Three.js / React Three Fiber 3D models & stage
│   │   │   ├── ui/             # Reusable UI widgets, navigation & modals
│   │   │   └── index.ts        # Centralized barrel exports
│   │   ├── config/             # Truthful site configuration & data definitions
│   │   ├── lib/                # API client, audio triggers & backend proxy
│   │   └── types/              # Centralized TypeScript models & contracts
│   ├── package.json            # Frontend dependencies & npm scripts
│   ├── tsconfig.json           # TypeScript configuration with @/* alias
│   ├── next.config.ts          # Next.js configuration
│   └── README.md               # Frontend-specific documentation
│
├── backend/                    # Python FastAPI REST API Microservice
│   ├── app/
│   │   ├── api/                # Endpoints (GitHub telemetry, projects, notes, stats)
│   │   ├── schemas/            # Pydantic response models
│   │   ├── services/           # GitHub REST integration & caching layer
│   │   └── main.py             # FastAPI entrypoint & CORS configuration
│   └── requirements.txt        # Python package dependencies (uvicorn, fastapi, httpx)
│
├── package.json                # Root monorepo workspace orchestrator
├── run_local.cmd               # One-click Windows runner (launches backend + frontend)
└── README.md                   # Repository overview & developer guide
```

---

## Quick Start

### 1. One-Click Full-Stack Launch (Windows)
Double-click or execute from the terminal:
```cmd
run_local.cmd
```
This automatically launches:
- **FastAPI Backend**: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)
- **Next.js Frontend**: `http://localhost:3000`

---

### 2. Manual Development Commands

#### From Repository Root:
```bash
# Start frontend dev server
npm run dev

# Compile frontend production build
npm run build

# Start FastAPI backend manually
npm run dev:backend
```

#### Running Frontend Standalone:
```bash
cd frontend
npm run dev
```

#### Running Backend Standalone:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

---

## Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Three.js / React Three Fiber, Framer Motion, Tailwind CSS v4, Lucide React
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, HTTPX
- **Data & APIs**: GitHub REST API v3, Server-Side Fallback Proxy Architecture
