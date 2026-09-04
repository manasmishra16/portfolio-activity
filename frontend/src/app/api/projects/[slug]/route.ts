import { NextRequest, NextResponse } from "next/server";
import { PROJECTS_DATA, ProjectItem } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

function normalizeProject(p: any): ProjectItem {
  let techArray: string[] = [];
  if (Array.isArray(p.technologies)) {
    techArray = p.technologies;
  } else if (typeof p.technologies_csv === "string") {
    techArray = p.technologies_csv.split(",").map((s: string) => s.trim());
  } else if (typeof p.technologies === "string") {
    techArray = p.technologies.split(",").map((s: string) => s.trim());
  }

  const localMatch = PROJECTS_DATA.find((item) => item.slug === p.slug);

  return {
    slug: p.slug || "project",
    number: p.number || "01",
    title: p.title || "Engineering System",
    tagline: p.tagline || p.subtitle || p.short_description || "System Architecture",
    category: p.category || "Machine Learning",
    year: p.year || "2026",
    status: p.status || "Completed",
    technologies: techArray.length > 0 ? techArray : ["TypeScript", "Python"],
    githubUrl: p.githubUrl || p.github_url || "https://github.com/manasmishra16",
    liveUrl: p.liveUrl || p.demo_url || undefined,
    description: p.description || p.short_description || p.long_description || "",
    architecture: p.architecture || p.approach || "",
    keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures : [],
    technicalChallenges: p.technicalChallenges || p.challenges || "",
    metrics: Array.isArray(p.metrics) ? p.metrics : [],
    accentColor: p.accentColor || "#ff5a1f",
    imageUrl: p.imageUrl || p.image_url || localMatch?.imageUrl || `/images/projects/${p.slug}.jpg`,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Check FastAPI first
  const fastApiRes = await fetchFromFastAPI<any>(`/api/projects/${slug}`);
  if (fastApiRes.data) {
    return NextResponse.json({
      data: normalizeProject(fastApiRes.data),
      source: "fastapi",
    });
  }

  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    return NextResponse.json(
      { error: `Project '${slug}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: project, source: "portfolio_api" });
}
