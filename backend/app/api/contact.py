import os
import time
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Header, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_

from app.core.database import get_db
from app.models.contact import ContactMessage, format_iso_utc
from app.schemas.contact import (
    ContactRequest,
    ContactResponse,
    ContactListResponse,
    ContactMessageItem,
    MessageStatusCounts,
    MessageStatusUpdate,
)
from app.services.email_service import send_contact_notification
from app.core.security import hash_ip, check_rate_limit, is_duplicate_submission

router = APIRouter()
logger = logging.getLogger("portfolio.contact")

def _get_admin_secret() -> str:
    return os.getenv("ADMIN_SECRET_KEY", "").strip()

@router.post("/", response_model=ContactResponse)
def submit_contact_message(
    req: ContactRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Submits a contact inquiry.
    Flow: Anti-spam check -> Database persistence (Source of Truth) -> Transactional email notification.
    """
    # 1. Anti-spam Honeypot Check: Bots that fill this hidden field are silently acknowledged
    if req.honeypot and req.honeypot.strip():
        logger.info(f"Bot caught by honeypot field. Suppressing submission silently.")
        return ContactResponse(
            success=True,
            message="Transmission received.",
            reference_id=f"msg_bot_{uuid.uuid4().hex[:6]}",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # 2. Extract Client IP & Check Rate Limiting
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    elif request.client:
        client_ip = request.client.host
    else:
        client_ip = "local-client"

    ip_h = hash_ip(client_ip)

    if not check_rate_limit(ip_h):
        logger.warning(f"Rate limit exceeded for client hash: {ip_h[:8]}...")
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Please wait a few minutes before transmitting another message.",
        )

    # 3. Duplicate Suppression (accidental double-click protection)
    if is_duplicate_submission(req.name, req.email, req.subject, req.message):
        logger.info(f"Duplicate submission detected within cooldown window from {req.email}.")
        return ContactResponse(
            success=True,
            message="Your message has already been received. Manas Mishra will get back to you shortly.",
            reference_id=f"msg_dup_{uuid.uuid4().hex[:6]}",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # 4. Save to PostgreSQL FIRST (Database is the absolute Source of Truth)
    ref_id = f"msg_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    now_utc = datetime.now(timezone.utc)

    contact_record = ContactMessage(
        id=ref_id,
        name=req.name.strip(),
        email=req.email.strip().lower(),
        subject=req.subject.strip(),
        message=req.message.strip(),
        status="new",
        email_notification_sent=False,
        ip_hash=ip_h,
        created_at=now_utc,
    )

    try:
        db.add(contact_record)
        db.commit()
        db.refresh(contact_record)
        logger.info(f"Contact message safely persisted to database. Ref ID: {ref_id}")
    except Exception as db_exc:
        db.rollback()
        logger.error(f"CRITICAL: Failed to persist contact message to database: {db_exc}")
        raise HTTPException(
            status_code=500,
            detail="Database service unavailable. Please contact directly at manasmishra16@gmail.com.",
        )

    # 5. Dispatch Email Notification (Resend API)
    try:
        notification_sent = send_contact_notification(
            name=contact_record.name,
            email=contact_record.email,
            subject=contact_record.subject,
            message=contact_record.message,
            reference_id=ref_id,
            received_at=now_utc.strftime("%Y-%m-%d %H:%M:%S UTC"),
        )
        if notification_sent:
            contact_record.email_notification_sent = True
            db.commit()
    except Exception as email_exc:
        # Crucial: Email failure NEVER fails the request or loses the database record
        logger.error(f"Email notification encountered an unexpected issue: {email_exc}")

    # 6. Return Clean Success Response to Visitor
    return ContactResponse(
        success=True,
        message="Message successfully received. Manas Mishra will get back to you shortly.",
        reference_id=ref_id,
        timestamp=now_utc.isoformat(),
    )

@router.get("/messages", response_model=ContactListResponse)
def get_contact_messages(
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    status: Optional[str] = Query(None, description="Filter by status: new, read, replied, archived"),
    q: Optional[str] = Query(None, description="Search query across name, email, subject, message"),
    db: Session = Depends(get_db),
):
    """
    Secure administrative endpoint for the portfolio owner to review received contact inquiries.
    Requires header: X-Admin-Key matching ADMIN_SECRET_KEY.
    Returns:
      - Paginated/filtered items
      - Filtered total count
      - Global status counts independent of pagination or active search
    """
    admin_secret = _get_admin_secret()
    if not admin_secret:
        raise HTTPException(
            status_code=403,
            detail="Admin message retrieval is disabled. Configure ADMIN_SECRET_KEY in server environment.",
        )

    if not x_admin_key or x_admin_key.strip() != admin_secret:
        logger.warning("Unauthorized access attempt to /api/contact/messages.")
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Valid X-Admin-Key header required.",
        )

    # 1. Calculate database-wide counts (always reflect full database state independent of pagination/search)
    total_all = db.query(ContactMessage).count()
    count_new = db.query(ContactMessage).filter(ContactMessage.status == "new").count()
    count_read = db.query(ContactMessage).filter(ContactMessage.status == "read").count()
    count_replied = db.query(ContactMessage).filter(ContactMessage.status == "replied").count()
    count_archived = db.query(ContactMessage).filter(ContactMessage.status == "archived").count()

    counts = MessageStatusCounts(
        total=total_all,
        new=count_new,
        read=count_read,
        replied=count_replied,
        archived=count_archived,
    )

    # 2. Build filtered query
    query = db.query(ContactMessage)

    if status and status.strip():
        clean_status = status.strip().lower()
        query = query.filter(ContactMessage.status == clean_status)

    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        # Safe parameterized ILIKE search across relevant fields
        query = query.filter(
            or_(
                ContactMessage.name.ilike(term),
                ContactMessage.email.ilike(term),
                ContactMessage.subject.ilike(term),
                ContactMessage.message.ilike(term),
            )
        )

    filtered_total = query.count()

    # 3. Newest-first ordering and pagination
    records = (
        query.order_by(desc(ContactMessage.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    # Note: ip_hash is strictly excluded from serialization
    items = [
        ContactMessageItem(
            id=r.id,
            name=r.name,
            email=r.email,
            subject=r.subject,
            message=r.message,
            status=r.status,
            email_notification_sent=r.email_notification_sent,
            created_at=format_iso_utc(r.created_at),
            updated_at=format_iso_utc(r.updated_at),
        )
        for r in records
    ]

    return ContactListResponse(
        total=filtered_total,
        items=items,
        messages=items,
        counts=counts,
    )

@router.patch("/messages/{message_id}", response_model=ContactMessageItem)
def update_message_status(
    message_id: str,
    payload: MessageStatusUpdate,
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    db: Session = Depends(get_db),
):
    """
    Secure endpoint to update message status (new, read, replied, archived).
    Protected via X-Admin-Key header matching ADMIN_SECRET_KEY.
    """
    admin_secret = _get_admin_secret()
    if not admin_secret:
        raise HTTPException(
            status_code=403,
            detail="Admin updates disabled. Configure ADMIN_SECRET_KEY in server environment.",
        )

    if not x_admin_key or x_admin_key.strip() != admin_secret:
        logger.warning(f"Unauthorized status update attempt on message {message_id}.")
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Valid X-Admin-Key header required.",
        )

    record = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Message not found.")

    record.status = payload.status
    record.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    logger.info(f"Updated status for message {message_id} to '{payload.status}'.")

    return ContactMessageItem(
        id=record.id,
        name=record.name,
        email=record.email,
        subject=record.subject,
        message=record.message,
        status=record.status,
        email_notification_sent=record.email_notification_sent,
        created_at=format_iso_utc(record.created_at),
        updated_at=format_iso_utc(record.updated_at),
    )
