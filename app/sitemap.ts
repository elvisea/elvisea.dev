/**
 * `/sitemap.xml`: páginas conhecidas, serviços, estudos de caso e posts
 * publicados. `/blog` só entra quando há posts (até lá a listagem tem
 * `noindex`).
 */
import type { MetadataRoute } from "next";

import { site } from "@/content/pt-BR/site";
import { blogRepository } from "@/features/blog/repository/blog-repository";
import { BLOG_PATH, postPath } from "@/features/blog/routes";
import { CONTACT_PATH } from "@/features/contact/routes";
import { EXPERIENCE_PATH } from "@/features/experience/routes";
import { HOW_I_WORK_PATH } from "@/features/how-i-work/routes";
import { defaultProjectsRepository } from "@/features/projects/repository/projects-repository";
import { PROJECTS_PATH, projectPath } from "@/features/projects/routes";
import { RESUME_PATH } from "@/features/resume/routes";
import { servicesRepository } from "@/features/services/repository/services-repository";
import { SERVICES_PATH, servicePath } from "@/features/services/routes";
import { ABOUT_PATH } from "@/features/about/routes";
import { buildSitemapEntries, type SitemapPage } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await blogRepository.list();

  const pages: SitemapPage[] = [
    { path: "/", changeFrequency: "monthly", priority: 1.0 },
    { path: EXPERIENCE_PATH, changeFrequency: "monthly", priority: 0.9 },
    { path: SERVICES_PATH, changeFrequency: "monthly", priority: 0.9 },
    ...servicesRepository.list().map((service) => ({
      path: servicePath(service.slug),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { path: PROJECTS_PATH, changeFrequency: "weekly", priority: 0.8 },
    { path: ABOUT_PATH, changeFrequency: "monthly", priority: 0.8 },
    { path: HOW_I_WORK_PATH, changeFrequency: "yearly", priority: 0.6 },
    { path: RESUME_PATH, changeFrequency: "monthly", priority: 0.7 },
    { path: CONTACT_PATH, changeFrequency: "yearly", priority: 0.5 },
    // Listagem vazia não entra (tem noindex até o primeiro post).
    ...(posts[0]
      ? [
          {
            path: BLOG_PATH,
            lastModified: posts[0].frontmatter.date,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...defaultProjectsRepository()
      .caseStudies()
      .map((project) => ({
        path: projectPath(project.slug),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ...posts.map((post) => ({
      path: postPath(post.slug),
      lastModified: post.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return buildSitemapEntries(site.url, pages);
}
