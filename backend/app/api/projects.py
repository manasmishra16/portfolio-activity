from fastapi import APIRouter, HTTPException

router = APIRouter()

PROJECTS = [
    {
        "slug": "heart-disease-prediction",
        "number": "01",
        "title": "Heart Disease Prediction System",
        "tagline": "Hybrid CNN-LSTM Deep Learning Clinical Risk Assessment",
        "category": "Machine Learning",
        "year": "2026",
        "status": "Completed",
        "technologies": ["TensorFlow", "CNN", "LSTM", "Flask", "Python", "NumPy", "Pandas", "Scikit-Learn"],
        "githubUrl": "https://github.com/manasmishra16/Heart-disease-prediction",
        "description": "Deep learning cardiovascular risk classification pipeline combining 1D-CNN spatial filters with bidirectional LSTM recurrent layers for multi-lead patient physiological signals.",
        "architecture": "Two-stage sequential neural pipeline: 1D temporal convolution for local invariant morphology extraction, followed by Bidirectional LSTM layers to capture long-term sequential progression, topped with dense dropout classification.",
        "keyFeatures": [
            "Hybrid 1D-CNN + Bi-LSTM neural architecture",
            "Real-time inference server built with Flask and Python",
            "94.6% validation accuracy on clinical test sets",
            "Interactive probability calibration and risk categorization"
        ],
        "technicalChallenges": "Handling high-variance multi-channel physiological signals with variable baseline drift and preventing gradient vanishing across elongated temporal sequence windows.",
        "metrics": [
            {"label": "Validation Accuracy", "value": "94.6%"},
            {"label": "AUC-ROC Score", "value": "0.962"},
            {"label": "Inference Latency", "value": "<15ms"},
            {"label": "Sequence Processing", "value": "Bidirectional"}
        ],
        "accentColor": "#ff5a1f",
        "imageUrl": "/images/projects/heart-disease-prediction.jpg"
    },
    {
        "slug": "mangoml-disease-prediction",
        "number": "02",
        "title": "MangoML Crop Disease Platform",
        "tagline": "Automated Agricultural Pathology Diagnosis & AutoML Engine",
        "category": "Data Science",
        "year": "2026",
        "status": "In Active Development",
        "technologies": ["Scikit-learn", "Pandas", "NumPy", "AutoML", "TypeScript", "React", "Tailwind CSS", "Vercel"],
        "githubUrl": "https://github.com/manasmishra16/mango-frontend",
        "liveUrl": "https://mango-frontend-flax.vercel.app",
        "description": "Machine learning platform for detecting foliar crop pathologies, featuring automated feature preprocessing, multi-model cross-validation tournaments, and a responsive web application.",
        "architecture": "End-to-end ML pipeline with automated robust scaling, outlier pruning, variance threshold filtering, and ensemble voting classification, coupled to a React/TypeScript frontend.",
        "keyFeatures": [
            "Automated feature engineering and outlier suppression",
            "Cross-validated model selection across tree ensembles",
            "Modern responsive web application deployed on Vercel",
            "Real-time confidence scoring and disease triage"
        ],
        "technicalChallenges": "Managing noisy agricultural measurement outliers, severe class imbalance across rare leaf pathologies, and delivering sub-second client-side visualization.",
        "metrics": [
            {"label": "F1-Score", "value": "91.8%"},
            {"label": "Models Evaluated", "value": "6 Algorithms"},
            {"label": "Deployment", "value": "Vercel Edge"},
            {"label": "Latency", "value": "240ms"}
        ],
        "accentColor": "#eab308",
        "imageUrl": "/images/projects/mangoml-disease-prediction.jpg"
    },
    {
        "slug": "pg-hostel-allocation-system",
        "number": "03",
        "title": "PG & Hostel Room Allocation System",
        "tagline": "Full-Stack Accommodation Reservation & Grievance Engine",
        "category": "Full-Stack Web",
        "year": "2025",
        "status": "Completed",
        "technologies": ["React", "PostgreSQL", "Supabase", "PLpgSQL", "Tailwind CSS", "TypeScript"],
        "githubUrl": "https://github.com/manasmishra16/pg-hostel-allocation-system",
        "description": "Full-stack web application for institutional hostel and PG room management, automating room allotments, real-time availability tracking, and complaint workflows.",
        "architecture": "Client-server architecture using React single-page frontend connected to Supabase backend-as-a-service with PostgreSQL relational database and PLpgSQL transactional triggers.",
        "keyFeatures": [
            "Automated room allotment logic preventing double-booking",
            "ACID-compliant PostgreSQL constraints and PLpgSQL triggers",
            "Student grievance ticketing and resolution dashboard",
            "Role-based authentication for residents and hostel wardens"
        ],
        "technicalChallenges": "Preventing race conditions during simultaneous room reservation requests through database-level pessimistic locking and atomic PLpgSQL stored procedures.",
        "metrics": [
            {"label": "Concurrency Safety", "value": "ACID Compliant"},
            {"label": "Database Engine", "value": "PostgreSQL 15"},
            {"label": "State Sync", "value": "Real-time"},
            {"label": "Auth Security", "value": "Supabase RLS"}
        ],
        "accentColor": "#06b6d4",
        "imageUrl": "/images/projects/pg-hostel-allocation-system.jpg"
    },
    {
        "slug": "zero-g-spatial-portfolio",
        "number": "04",
        "title": "Zero-Gravity 3D Spatial Computing Portfolio",
        "tagline": "Interactive 60 FPS Creative Developer Portfolio & Workstation",
        "category": "Creative Tech",
        "year": "2026",
        "status": "Completed",
        "technologies": ["Next.js 16", "React 19", "Three.js", "React Three Fiber", "Web Audio API", "Tailwind CSS", "FastAPI"],
        "githubUrl": "https://github.com/manasmishra16/portfolio",
        "description": "Zero-gravity spatial portfolio engineered with Next.js 16, React Three Fiber, custom procedural OLED workstation canvas, studio lighting presets, and full-stack API integration.",
        "architecture": "Hybrid Next.js 16 App Router application utilizing React Three Fiber for WebGL GPU rendering, Web Audio API synthesizer, and server-side cached GitHub telemetry routes.",
        "keyFeatures": [
            "3D interactive laptop with real-time dynamic terminal canvas",
            "Clean two-zone hero composition guaranteeing text legibility",
            "Integrated Web Audio API spatial synthesizer",
            "Dual-backend architecture (Next.js Edge + FastAPI Service)"
        ],
        "technicalChallenges": "Maintaining a steady 60 FPS on mobile and desktop while procedurally drawing and rendering a 2048x1280 dynamic canvas texture inside a WebGL 3D context.",
        "metrics": [
            {"label": "Frame Rate", "value": "60.0 FPS"},
            {"label": "Render Pipeline", "value": "WebGL / R3F"},
            {"label": "Audio Engine", "value": "Web Audio API"},
            {"label": "Build Target", "value": "Turbopack"}
        ],
        "accentColor": "#ff5a1f",
        "imageUrl": "/images/projects/zero-g-spatial-portfolio.jpg"
    }
]

@router.get("/")
def get_all_projects():
    return {"data": PROJECTS, "total": len(PROJECTS)}

@router.get("/{slug}")
def get_project_by_slug(slug: str):
    for p in PROJECTS:
        if p["slug"] == slug:
            return {"data": p}
    raise HTTPException(status_code=404, detail=f"Project '{slug}' not found")
