from pydantic import BaseModel, EmailStr, Field

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(default="Portfolio Inquiry", max_length=150)
    message: str = Field(..., min_length=5, max_length=2000)

class ContactResponse(BaseModel):
    success: bool
    message: str
    reference_id: str
    timestamp: str
