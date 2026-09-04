import { NextResponse } from "next/server";
import { SITE_CONFIG, SKILLS_CONFIG, CERTIFICATIONS_DATA, PROJECTS_DATA } from "@/config/site";
import { fetchFromFastAPI } from "@/lib/backend-proxy";

export async function GET() {
  const fastApiRes = await fetchFromFastAPI("/api/resume");
  if (fastApiRes.data) {
    return NextResponse.json({
      data: fastApiRes.data,
      source: "fastapi",
    });
  }

  const resumePayload = {
    profile: {
      name: SITE_CONFIG.name,
      title: SITE_CONFIG.headline,
      positioning: SITE_CONFIG.tagline,
      email: SITE_CONFIG.email,
      github: SITE_CONFIG.github,
      linkedin: SITE_CONFIG.linkedin,
      location: SITE_CONFIG.education.location,
      summary: "Computer Science & Engineering undergraduate specializing in deep learning architectures (CNN + LSTM), automated feature pipelines, and high-performance full-stack web systems.",
    },
    education: SITE_CONFIG.education,
    skills: SKILLS_CONFIG,
    certifications: CERTIFICATIONS_DATA,
    projects: PROJECTS_DATA.map((p) => ({
      name: p.title,
      category: p.category,
      technologies: p.technologies,
      description: p.description,
      githubUrl: p.githubUrl,
    })),
  };

  return NextResponse.json({
    data: resumePayload,
    source: "portfolio_api",
    timestamp: new Date().toISOString(),
  });
}
