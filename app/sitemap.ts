/**
 * `/sitemap.xml`: páginas conhecidas e cada post publicado. `/blog` só entra
 * quando há posts.
 * `lastModified` dos posts vem do `date` do frontmatter.
 */
import type { MetadataRoute } from "next";

import { site } from "@/content/pt-BR/site";
import { defaultProjectsRepository } from "@/features/projects/repository/projects-repository";
import { projectPath } from "@/features/projects/routes";
import { getServiceSlugs } from "@/features/services/detail/view-model/get-service-detail-view-model";
import { SERVICES_PATH, servicePath } from "@/features/services/routes";
import { getAllPosts } from "@/lib/blog";

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
    {
      url: `${site.url}${SERVICES_PATH}`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...getServiceSlugs().map((slug) => ({
      url: `${site.url}${servicePath(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/projetos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${site.url}/como-trabalho`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    { url: `${site.url}/curriculo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contato`, changeFrequency: "yearly", priority: 0.5 },
    // Listagem vazia não entra (tem noindex até o primeiro post).
    ...(posts.length > 0
      ? [
          {
            url: `${site.url}/blog`,
            lastModified: blogLastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...defaultProjectsRepository()
      .caseStudies()
      .map((p) => ({
        url: `${site.url}${projectPath(p.slug)}`,
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
