from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/")
def get_portfolio_stats():
    return {
        "data": {
            "cgpa": "7.72",
            "expectedGraduation": "2027",
            "institution": "KSIT Bengaluru",
            "publicRepos": 6,
            "coreProjects": 4,
            "verifiedCertifications": 3,
            "modelAccuracy": "94.6%",
            "routesCompiled": 28,
            "fpsTarget": 60,
            "techStackPillars": ["Data & ML", "Full-Stack Web", "Creative Computing"],
            "lastSynced": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        },
        "status": "online"
    }
