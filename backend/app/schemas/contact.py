from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Sender's full name")
    email: EmailStr = Field(..., max_length=255, description="Sender's email address")
    subject: str = Field(default="Portfolio Inquiry", min_length=2, max_length=200, description="Message topic or title")
    message: str = Field(..., min_length=5, max_length=3000, description="Content of the message")
    honeypot: Optional[str] = Field(default=None, description="Anti-spam hidden honeypot field")

class ContactResponse(BaseModel):
    success: bool
    message: str
    reference_id: str
    timestamp: str

class ContactMessageItem(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    email_notification_sent: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class MessageStatusCounts(BaseModel):
    total: int = 0
    new: int = 0
    read: int = 0
    replied: int = 0
    archived: int = 0

class MessageStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|read|replied|archived)$", description="Target status: new, read, replied, archived")

class ContactListResponse(BaseModel):
    total: int
    items: List[ContactMessageItem]
    messages: List[ContactMessageItem]  # Backwards-compatible alias
    counts: MessageStatusCounts
