from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/health")
def check_health():
    return {
        "status": "healthy",
        "service": "manas-mishra-fastapi-backend",
        "timestamp": time.time(),
        "positioning": "DATA → INTELLIGENCE → APPLICATION"
    }
