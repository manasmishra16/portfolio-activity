import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "manas-mishra-portfolio-api",
    engineer: "Manas Mishra",
    positioning: "DATA → INTELLIGENCE → APPLICATION",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
  });
}
