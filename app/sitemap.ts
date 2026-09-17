/**
 * `/sitemap.xml`: páginas conhecidas e cada post publicado.
 * `lastModified` dos posts vem do `date` do frontmatter.
 */
import type { MetadataRoute } from "next";

import { site } from "@/content/pt-BR/site";
import { getAllPosts } from "@/lib/blog";
import { getCaseStudies } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const blogLastModified = posts[0]
    ? new Date(`${posts[0].frontmatter.date}T00:00:00Z`)
    : undefined;

  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1.0 },
    {
      url: `${site.url}/experiencia`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${site.url}/projetos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${site.url}/como-trabalho`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    { url: `${site.url}/curriculo`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${site.url}/blog`,
      lastModified: blogLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getCaseStudies().map((p) => ({
      url: `${site.url}/projetos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(`${p.frontmatter.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
