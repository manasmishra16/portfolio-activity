from fastapi import APIRouter
from app.services.github_service import github_service

router = APIRouter()

@router.get("/profile")
def get_profile():
    """Returns cached GitHub user profile telemetry for @manasmishra16."""
    return github_service.get_profile()

@router.get("/repos")
def get_repos():
    """Returns cached public repositories with languages, stars, forks, and metadata."""
    return github_service.get_repos()

@router.get("/activity")
def get_activity():
    """Returns real recent public activity, pushes, and commit events."""
    return github_service.get_activity()
