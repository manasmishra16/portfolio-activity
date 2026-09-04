from fastapi import APIRouter, HTTPException
from app.schemas.contact import ContactRequest, ContactResponse
import time
import uuid

router = APIRouter()

# In-memory storage / audit log
MESSAGES_LOG = []

@router.post("/", response_model=ContactResponse)
def submit_contact_message(req: ContactRequest):
    ref_id = f"msg_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    record = {
        "id": ref_id,
        "name": req.name,
        "email": req.email,
        "subject": req.subject,
        "message": req.message,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    MESSAGES_LOG.append(record)
    print(f"📨 [FastAPI] Message received from {req.name} <{req.email}> (Ref: {ref_id})")

    return ContactResponse(
        success=True,
        message="Message successfully received. Manas Mishra will get back to you shortly.",
        reference_id=ref_id,
        timestamp=record["timestamp"]
    )
