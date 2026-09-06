import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

def format_iso_utc(dt: Optional[datetime]) -> Optional[str]:
    """
    Serializes a database datetime into an explicit ISO-8601 UTC timestamp with timezone offset.
    Guarantees timestamps are never ambiguous: e.g. '2026-09-06T19:55:00+00:00'.
    """
    if not dt:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.isoformat()

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="new")
    email_notification_sent = Column(Boolean, nullable=False, default=False)
    ip_hash = Column(String(64), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), nullable=True, onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "email_notification_sent": self.email_notification_sent,
            "created_at": format_iso_utc(self.created_at),
            "updated_at": format_iso_utc(self.updated_at),
        }
