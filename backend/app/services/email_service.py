import os
import html
import logging
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("portfolio.email")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
CONTACT_RECEIVER_EMAIL = os.getenv("CONTACT_RECEIVER_EMAIL", "manasmishra16@gmail.com").strip()
CONTACT_FROM_EMAIL = os.getenv("CONTACT_FROM_EMAIL", "Portfolio Inquiries <onboarding@resend.dev>").strip()

def send_contact_notification(
    name: str,
    email: str,
    subject: str,
    message: str,
    reference_id: str,
    received_at: str = None,
) -> bool:
    """
    Dispatches a transactional notification email to the portfolio owner using Resend.
    Returns True if notification succeeded, False if failed (without raising exceptions).
    """
    if not RESEND_API_KEY:
        logger.warning(
            "RESEND_API_KEY is not set. Email notification skipped (message is safely preserved in database). "
            "Set RESEND_API_KEY in production to receive instant email notifications."
        )
        return False

    timestamp = received_at or datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Sanitize and HTML-escape user inputs to prevent HTML injection in email clients
    safe_name = html.escape(name.strip())
    safe_email = html.escape(email.strip())
    safe_subject = html.escape(subject.strip())
    safe_message = html.escape(message.strip()).replace("\n", "<br>")

    email_subject = f"New Portfolio Contact — {subject.strip()}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }}
          .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
          .header {{ background: #0c0d0e; padding: 24px; border-bottom: 3px solid #ff5a1f; }}
          .header h1 {{ margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }}
          .header p {{ margin: 4px 0 0 0; color: #ff5a1f; font-size: 11px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; }}
          .content {{ padding: 28px; }}
          .field {{ margin-bottom: 20px; }}
          .label {{ font-size: 11px; font-family: monospace; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 4px; font-weight: 600; }}
          .value {{ font-size: 15px; color: #0f172a; font-weight: 500; word-break: break-word; }}
          .message-box {{ background: #f1f5f9; border-left: 4px solid #ff5a1f; padding: 16px; border-radius: 6px; font-size: 14px; color: #1e293b; line-height: 1.7; white-space: pre-wrap; }}
          .footer {{ background: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; font-family: monospace; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Message</h1>
            <p>DATA → INTELLIGENCE → APPLICATION // INQUIRY</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">SENDER NAME</div>
              <div class="value">{safe_name}</div>
            </div>
            <div class="field">
              <div class="label">SENDER EMAIL</div>
              <div class="value"><a href="mailto:{safe_email}" style="color: #ff5a1f; text-decoration: none;">{safe_email}</a></div>
            </div>
            <div class="field">
              <div class="label">SUBJECT / TOPIC</div>
              <div class="value">{safe_subject}</div>
            </div>
            <div class="field">
              <div class="label">MESSAGE BRIEF</div>
              <div class="message-box">{safe_message}</div>
            </div>
          </div>
          <div class="footer">
            Reference: {reference_id} &bull; Received: {timestamp}
          </div>
        </div>
      </body>
    </html>
    """

    plain_content = f"""
New Portfolio Contact Message
=============================
Name:     {name.strip()}
Email:    {email.strip()}
Subject:  {subject.strip()}

Message:
{message.strip()}

-----------------------------
Reference: {reference_id}
Received:  {timestamp}
"""

    payload = {
        "from": CONTACT_FROM_EMAIL,
        "to": [CONTACT_RECEIVER_EMAIL],
        "reply_to": email.strip(),
        "subject": email_subject,
        "html": html_content,
        "text": plain_content,
    }

    try:
        with httpx.Client(timeout=8.0) as client:
            response = client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if response.is_success:
                res_json = response.json()
                logger.info(f"Email notification dispatched successfully via Resend. ID: {res_json.get('id')}")
                return True
            else:
                logger.error(f"Resend API error {response.status_code}: {response.text}")
                return False
    except Exception as exc:
        logger.error(f"Failed to transmit email notification via Resend: {exc}")
        return False
