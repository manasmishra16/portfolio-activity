import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
  }
}
