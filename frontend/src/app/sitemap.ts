import { MetadataRoute } from "next";
import { PROJECTS_DATA, NOTES_DATA } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://manasmishra.dev";

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/experience",
    "/skills",
    "/certifications",
    "/achievements",
    "/notes",
    "/resume",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = PROJECTS_DATA.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const noteRoutes = NOTES_DATA.map((n) => ({
    url: `${baseUrl}/notes/${n.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
}
