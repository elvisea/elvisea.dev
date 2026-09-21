/** Montagem das entradas do sitemap (`app/sitemap.ts`), sem tocar em dados. */
import type { MetadataRoute } from "next";

type Entry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<Entry["changeFrequency"]>;

export interface SitemapPage {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  /** `YYYY-MM-DD` da última alteração, quando houver. */
  lastModified?: string;
}

/** Data ao meio-dia UTC, para o dia não mudar por fuso. */
function toDate(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

export function buildSitemapEntries(
  siteUrl: string,
  pages: readonly SitemapPage[],
): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    ...(page.lastModified ? { lastModified: toDate(page.lastModified) } : {}),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
