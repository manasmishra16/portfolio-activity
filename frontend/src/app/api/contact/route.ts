import { NextRequest, NextResponse } from "next/server";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

interface ContactFastAPIResponse {
  success: boolean;
  message: string;
  reference_id: string;
  timestamp: string;
}

// In-memory sliding-window IP rate limiter on Next.js edge
const ipSubmissionTimestamps = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // 1. Silent Honeypot Trap
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Transmission recorded.",
        referenceId: `msg_bot_${Math.random().toString(36).substring(2, 8)}`,
      });
    }

    // 2. Validate Required Fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Valid name (at least 2 characters) is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    // 3. Client IP Extraction & Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "local-client";
    const lastTime = ipSubmissionTimestamps.get(ip) || 0;
    const now = Date.now();

    if (now - lastTime < RATE_LIMIT_WINDOW_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastTime)) / 1000);
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${waitSec}s before sending another message.` },
        { status: 429 }
      );
    }

    ipSubmissionTimestamps.set(ip, now);

    // Clean up memory cache
    if (ipSubmissionTimestamps.size > 200) {
      for (const [key, timestamp] of ipSubmissionTimestamps.entries()) {
        if (now - timestamp > RATE_LIMIT_WINDOW_MS * 2) {
          ipSubmissionTimestamps.delete(key);
        }
      }
    }

    // 4. Forward to FastAPI backend (which saves to PostgreSQL and triggers Resend notification)
    const fastApiResult = await fetchFromFastAPI<ContactFastAPIResponse>("/api/contact/", {
      method: "POST",
      headers: {
        "X-Forwarded-For": ip,
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? String(subject).trim() : "Portfolio Inquiry",
        message: message.trim(),
        honeypot: honeypot || null,
      }),
    });

    if (fastApiResult.data && fastApiResult.data.success) {
      return NextResponse.json({
        success: true,
        message: fastApiResult.data.message || "Message successfully transmitted to Manas Mishra.",
        referenceId: fastApiResult.data.reference_id,
        timestamp: fastApiResult.data.timestamp,
      });
    }

    // If FastAPI was unreachable or returned an error
    if (fastApiResult.error) {
      console.warn("FastAPI contact proxy warning:", fastApiResult.error);
    }

    return NextResponse.json(
      {
        error: "Unable to transmit your message right now. Please try again in a moment or email me directly at manasmishra16@gmail.com.",
      },
      { status: 503 }
    );
  } catch (err) {
    console.error("Contact route handler error:", err);
    return NextResponse.json(
      { error: "Unable to process message transmission. Please email directly at manasmishra16@gmail.com." },
      { status: 500 }
    );
  }
}
