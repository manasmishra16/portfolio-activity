from fastapi import APIRouter

router = APIRouter()

RESUME_METADATA = {
    "profile": {
        "name": "Manas Mishra",
        "title": "Computer Science & Engineering Undergraduate",
        "positioning": "DATA → INTELLIGENCE → APPLICATION",
        "email": "manasmishra16@gmail.com",
        "github": "https://github.com/manasmishra16",
        "linkedin": "https://linkedin.com/in/manasmishra16",
        "location": "Bengaluru, Karnataka, India",
        "summary": "Computer Science & Engineering undergraduate specializing in deep learning architectures (CNN + LSTM), automated feature pipelines, and high-performance full-stack web systems. Proven record of building end-to-end data-driven software from mathematical foundations to production web applications."
    },
    "education": {
        "degree": "Bachelor of Engineering in Computer Science & Engineering",
        "institution": "KS Institute of Technology",
        "location": "Bengaluru, India",
        "expectedGraduation": "2027",
        "cgpa": "7.72",
        "currentSemester": "6th Semester",
        "coursework": [
            "Data Structures & Algorithms",
            "Database Management Systems",
            "Operating Systems",
            "Computer Networks",
            "Object-Oriented Programming (Java)",
            "Machine Learning",
            "Software Engineering"
        ]
    },
    "skills": {
        "languages": ["Java", "Python", "TypeScript", "JavaScript", "C/C++", "SQL"],
        "data_ml": ["TensorFlow", "Scikit-Learn", "NumPy", "Pandas", "AutoML", "Deep Learning (CNN + LSTM)", "Data Preprocessing"],
        "full_stack": ["React 19", "Next.js 16", "PostgreSQL", "Supabase", "FastAPI", "Tailwind CSS", "REST APIs"],
        "tools": ["Git", "GitHub Actions", "Docker", "VS Code", "Vercel", "Three.js", "Web Audio API"]
    },
    "certifications": [
        {
            "id": "cert-1",
            "title": "Foundations: Data, Data, Everywhere",
            "issuer": "Google Career Certificates",
            "date": "2024",
            "verified": True
        },
        {
            "id": "cert-2",
            "title": "Data Analysis with Python",
            "issuer": "IBM",
            "date": "2024",
            "verified": True
        },
        {
            "id": "cert-3",
            "title": "Introduction to Database Systems",
            "issuer": "Infosys Springboard",
            "date": "2024",
            "verified": True
        }
    ],
    "projects": [
        {
            "name": "Heart Disease Prediction System",
            "tech": "TensorFlow, CNN, LSTM, Flask, Python",
            "highlight": "Hybrid deep learning clinical classification achieving 94.6% validation accuracy and low-latency inference."
        },
        {
            "name": "MangoML Crop Disease Platform",
            "tech": "Scikit-learn, Pandas, React, TypeScript, Vercel",
            "highlight": "Automated agricultural pathology diagnosis pipeline with real-time confidence scores and dataset telemetry."
        },
        {
            "name": "PG & Hostel Room Allocation System",
            "tech": "React, PostgreSQL, Supabase, PLpgSQL",
            "highlight": "Full-stack institutional accommodation reservation system with ACID transactional triggers and real-time room status."
        },
        {
            "name": "Zero-Gravity 3D Spatial Computing Portfolio",
            "tech": "Next.js 16, React 19, Three.js, Web Audio API, FastAPI",
            "highlight": "Sustained 60 FPS brutalist creative engineering workstation with live GitHub API telemetry and procedural OLED canvas."
        }
    ]
}

@router.get("/")
def get_resume_metadata():
    return {"data": RESUME_METADATA, "status": "verified"}
