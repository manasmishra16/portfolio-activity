import { NextResponse } from "next/server";
import { NOTES_DATA } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

export async function GET() {
  // Attempt proxy to FastAPI first
  const fastApiRes = await fetchFromFastAPI("/api/notes");
  if (fastApiRes.data) {
    return NextResponse.json({
      data: fastApiRes.data,
      total: Array.isArray(fastApiRes.data) ? fastApiRes.data.length : NOTES_DATA.length,
      source: "fastapi",
    });
  }

  // Fallback to verified local notes data
  return NextResponse.json({
    data: NOTES_DATA,
    total: NOTES_DATA.length,
    source: "portfolio_api",
    timestamp: new Date().toISOString(),
  });
}
