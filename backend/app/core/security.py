import hashlib
import time
from typing import Dict, Tuple

# Rate limiter state: ip_hash -> list of timestamps
_submission_windows: Dict[str, list] = {}
# Duplicate detector state: submission_hash -> timestamp
_recent_hashes: Dict[str, float] = {}

RATE_LIMIT_WINDOW_SECONDS = 300  # 5 minutes
MAX_SUBMISSIONS_PER_WINDOW = 4   # max 4 submissions per 5 minutes per IP hash
DUPLICATE_COOLDOWN_SECONDS = 30  # suppress exact duplicate payloads within 30 seconds

def hash_ip(ip: str) -> str:
    """Hashes visitor IP address using SHA-256 for privacy-conscious abuse detection."""
    if not ip or ip in ("local-client", "127.0.0.1", "::1"):
        return "local_developer"
    # Salt with static internal pepper
    pepper = "manas_portfolio_secure_hash"
    return hashlib.sha256(f"{pepper}:{ip}".encode("utf-8")).hexdigest()

def check_rate_limit(ip_hash: str) -> bool:
    """Returns True if request is within allowed limits, False if rate-limited."""
    now = time.time()
    timestamps = _submission_windows.get(ip_hash, [])
    # Filter out entries older than window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    
    if len(timestamps) >= MAX_SUBMISSIONS_PER_WINDOW:
        _submission_windows[ip_hash] = timestamps
        return False
    
    timestamps.append(now)
    _submission_windows[ip_hash] = timestamps
    return True

def is_duplicate_submission(name: str, email: str, subject: str, message: str) -> bool:
    """Detects immediate duplicate submissions (e.g. from rapid double clicks)."""
    now = time.time()
    payload_key = hashlib.sha256(
        f"{name.strip().lower()}:{email.strip().lower()}:{subject.strip().lower()}:{message.strip()}".encode("utf-8")
    ).hexdigest()

    # Clean old cache entries
    expired_keys = [k for k, t in _recent_hashes.items() if now - t > DUPLICATE_COOLDOWN_SECONDS * 2]
    for k in expired_keys:
        del _recent_hashes[k]

    if payload_key in _recent_hashes:
        if now - _recent_hashes[payload_key] < DUPLICATE_COOLDOWN_SECONDS:
            return True

    _recent_hashes[payload_key] = now
    return False
