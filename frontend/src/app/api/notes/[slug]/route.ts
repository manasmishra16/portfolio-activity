import { NextResponse } from "next/server";
import { NOTES_DATA } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  const { slug } = await context.params;

  // Attempt proxy to FastAPI first
  const fastApiRes = await fetchFromFastAPI(`/api/notes/${slug}`);
  if (fastApiRes.data) {
    return NextResponse.json({
      data: fastApiRes.data,
      source: "fastapi",
    });
  }

  const note = NOTES_DATA.find((n) => n.slug === slug);
  if (!note) {
    return NextResponse.json({ error: `Note '${slug}' not found` }, { status: 404 });
  }

  return NextResponse.json({
    data: note,
    source: "portfolio_api",
    timestamp: new Date().toISOString(),
  });
}
