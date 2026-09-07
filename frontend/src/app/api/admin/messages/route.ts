import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const adminSecret = process.env.ADMIN_SECRET_KEY?.trim();
    if (!adminSecret) {
      console.error("ADMIN_SECRET_KEY is missing in Next.js server environment.");
      return NextResponse.json(
        { error: "Admin API configuration error on server." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const queryParams = new URLSearchParams({ limit, offset });
    if (status && status !== "all") queryParams.set("status", status);
    if (q && q.trim()) queryParams.set("q", q.trim());

    const targetUrl = `${FASTAPI_BASE_URL}/api/contact/messages?${queryParams.toString()}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Admin-Key": adminSecret,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `FastAPI responded with status ${res.status}: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin messages proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch contact messages from backend." },
      { status: 500 }
    );
  }
}
