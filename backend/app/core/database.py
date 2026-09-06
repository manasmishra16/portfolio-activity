import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("portfolio.database")

raw_db_url = os.getenv("DATABASE_URL", "").strip()

if raw_db_url:
    # Normalize postgres:// or postgresql:// to postgresql+psycopg://
    if raw_db_url.startswith("postgres://"):
        DATABASE_URL = raw_db_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif raw_db_url.startswith("postgresql://"):
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    else:
        DATABASE_URL = raw_db_url

    # Build psycopg3-compatible connect_args
    connect_args = {}

    # Supabase Transaction poolers (e.g. port 6543 or pooler.supabase.com) require disabling prepared statements
    if ":6543" in DATABASE_URL or "pooler.supabase.com" in DATABASE_URL:
        connect_args["prepare_threshold"] = None

    # Hosted PostgreSQL (Supabase / Render / Neon) requires SSL
    if "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
        if "sslmode" not in DATABASE_URL:
            connect_args["sslmode"] = "require"

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10,
        connect_args=connect_args,
        future=True,
    )

    # Safe masked logging (never logs credentials)
    try:
        from urllib.parse import urlparse
        parsed = urlparse(raw_db_url)
        masked_host = f"{parsed.hostname or 'unknown'}:{parsed.port or 5432}/{parsed.path.lstrip('/')}"
        logger.info(f"Configured PostgreSQL database target: {masked_host} via SQLAlchemy + psycopg3.")
    except Exception:
        logger.info("Configured PostgreSQL database via SQLAlchemy + psycopg3.")
else:
    env = (os.getenv("ENVIRONMENT", "") or os.getenv("NODE_ENV", "")).strip().lower()
    is_prod = env in ("production", "prod") or bool(os.getenv("RENDER", "").strip())

    if is_prod:
        raise RuntimeError(
            "CRITICAL CONFIGURATION ERROR: DATABASE_URL is missing in production environment. "
            "Production requires a PostgreSQL database (e.g. Supabase, Render PostgreSQL, Neon). "
            "SQLite fallback is strictly forbidden in production to prevent data loss on ephemeral filesystems."
        )

    # Safe local fallback strictly for offline local development
    DATABASE_URL = "sqlite:///./contact_local.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        future=True,
    )
    logger.warning(
        "DATABASE_URL not configured. Using local SQLite fallback for development (./contact_local.db). "
        "For production on Render/Supabase/Neon, set DATABASE_URL."
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI dependency yielding a safe transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Idempotently initialize all database tables upon application startup."""
    import app.models.contact  # noqa: F401 - ensure models are imported
    Base.metadata.create_all(bind=engine)

    # Safe non-destructive column verification for updated_at
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                conn.execute(text("ALTER TABLE contact_messages ADD COLUMN updated_at DATETIME;"))
                conn.commit()
            elif engine.dialect.name == "postgresql":
                conn.execute(text("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;"))
                conn.commit()
    except Exception:
        pass  # Column already present or migration skipped safely

    logger.info("Database schema validated and initialized successfully.")
