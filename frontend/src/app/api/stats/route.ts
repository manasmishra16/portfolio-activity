import { NextResponse } from "next/server";
import { SITE_CONFIG, PROJECTS_DATA, CERTIFICATIONS_DATA } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

export async function GET() {
  const fastApiRes = await fetchFromFastAPI("/api/stats");
  if (fastApiRes.data) {
    return NextResponse.json({
      data: fastApiRes.data,
      source: "fastapi",
    });
  }

  const statsPayload = {
    cgpa: SITE_CONFIG.education.cgpa,
    expectedGraduation: SITE_CONFIG.education.expectedGraduation,
    institution: SITE_CONFIG.education.institution,
    publicRepos: 6,
    coreProjects: PROJECTS_DATA.length,
    verifiedCertifications: CERTIFICATIONS_DATA.length,
    modelAccuracy: "94.6%",
    routesCompiled: 28,
    fpsTarget: 60,
    techStackPillars: ["Data & ML", "Full-Stack Web", "Creative Computing"],
    lastSynced: new Date().toISOString(),
  };

  return NextResponse.json({
    data: statsPayload,
    source: "portfolio_api",
  });
}
