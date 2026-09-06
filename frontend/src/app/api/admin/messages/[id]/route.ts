import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-session";

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const adminSecret = process.env.ADMIN_SECRET_KEY?.trim();
    if (!adminSecret) {
      return NextResponse.json(
        { error: "Admin API configuration error on server." },
        { status: 500 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Allowed values: new, read, replied, archived" },
        { status: 400 }
      );
    }

    const targetUrl = `${FASTAPI_BASE_URL}/api/contact/messages/${encodeURIComponent(id)}`;

    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Admin-Key": adminSecret,
      },
      body: JSON.stringify({ status }),
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
    console.error("Admin status update proxy error:", err);
    return NextResponse.json(
      { error: "Failed to update message status on backend." },
      { status: 500 }
    );
  }
}
