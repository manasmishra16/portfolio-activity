import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-session";

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret } = body;

    if (!secret || typeof secret !== "string" || !secret.trim()) {
      return NextResponse.json({ error: "Admin secret is required." }, { status: 400 });
    }

    const trimmedSecret = secret.trim();
    let isAuthorized = false;

    // Check 1: If Next.js has ADMIN_SECRET_KEY in its environment, check directly
    const envAdminSecret = process.env.ADMIN_SECRET_KEY?.trim();
    if (envAdminSecret && envAdminSecret === trimmedSecret) {
      isAuthorized = true;
    }

    // Check 2: If not matched directly or env is not loaded, verify against FastAPI
    if (!isAuthorized) {
      try {
        const checkRes = await fetch(`${FASTAPI_BASE_URL}/api/contact/messages?limit=1`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "X-Admin-Key": trimmedSecret,
          },
        });
        if (checkRes.ok) {
          isAuthorized = true;
        }
      } catch (backendErr) {
        console.error("Failed to reach FastAPI backend for admin authentication check:", backendErr);
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Invalid administration credentials." },
        { status: 401 }
      );
    }

    // Authentication succeeded: set opaque HttpOnly signed session cookie
    await setAdminSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Session authenticated successfully.",
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Internal authentication error." },
      { status: 500 }
    );
  }
}
