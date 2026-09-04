import { NextRequest, NextResponse } from "next/server";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

// Simple IP / session submission rate limiter
const ipSubmissionTimestamps = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
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

    // Rate limit check
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

    // Clean up old entries
    if (ipSubmissionTimestamps.size > 200) {
      for (const [key, timestamp] of ipSubmissionTimestamps.entries()) {
        if (now - timestamp > RATE_LIMIT_WINDOW_MS * 2) {
          ipSubmissionTimestamps.delete(key);
        }
      }
    }

    // Structured message transmission record
    const messageRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? String(subject).trim() : "General Inquiry",
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      recipient: "manasmishra16@gmail.com",
    };

    // Forward to FastAPI backend audit log asynchronously
    fetchFromFastAPI("/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }).catch(() => {});

    // Log to server console
    console.log("📨 Contact Form Transmission Received:", JSON.stringify(messageRecord, null, 2));

    return NextResponse.json({
      success: true,
      message: "Message successfully transmitted to Manas Mishra.",
      referenceId: messageRecord.id,
      timestamp: messageRecord.receivedAt,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
