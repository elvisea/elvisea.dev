/**
 * Fachada pública do blog: **único ponto de import** para rotas e
 * componentes (`@/lib/blog`).
 *
 * As funções usam `React.cache` para que lista, prévia, sitemap e RSS
 * compartilhem a mesma leitura dos arquivos durante o build.
 *
 * Drafts (`draft: true`) são filtrados **aqui**: a fonte (`./source.ts`)
 * devolve tudo para que o filtro seja testável separadamente.
 *
 * @module lib/blog
 */
import "server-only";
import { cache } from "react";

import { renderMarkdown } from "@/lib/markdown/render";
import { extractToc } from "@/lib/markdown/toc";

import { readingMinutes } from "./reading-time";
import type { PostSummary } from "./schema";
import { loadAllPostsFromFs } from "./source";

/** Sumário só aparece em posts com pelo menos esta quantidade de `h2`. */
export const TOC_MIN_SECTIONS = 3;

/** Posts publicados, do mais recente para o mais antigo. */
export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  const all = await loadAllPostsFromFs();
  return all
    .filter((p) => !p.frontmatter.draft)
    .map(({ raw, ...rest }) => ({
      ...rest,
      readingMinutes: readingMinutes(raw),
    }));
});

/** Os `n` posts mais recentes (prévia da home). Chamar sempre com argumento. */
export const getRecentPosts = cache(async (n: number) =>
  (await getAllPosts()).slice(0, n),
);

/** Post publicado pelo slug, ou `null`. */
export const getPostBySlug = cache(
  async (slug: string) =>
    (await getAllPosts()).find((p) => p.slug === slug) ?? null,
);

/** Slugs publicados (`generateStaticParams`, sitemap). */
export const getAllSlugs = cache(async () =>
  (await getAllPosts()).map((p) => p.slug),
);

/**
 * Post com o corpo em HTML e o sumário. `toc` vem vazio quando o post tem
 * menos de `TOC_MIN_SECTIONS` seções.
 */
export const getPostWithHtml = cache(async (slug: string) => {
  const all = await loadAllPostsFromFs();
  const post = all.find((p) => p.slug === slug && !p.frontmatter.draft);
  if (!post) return null;

  const [html, toc] = [await renderMarkdown(post.raw), extractToc(post.raw)];
  const sections = toc.filter((item) => item.depth === 2).length;

  return {
    post: { ...post, readingMinutes: readingMinutes(post.raw) },
    html,
    toc: sections >= TOC_MIN_SECTIONS ? toc : [],
  };
});

export type { Post, PostFrontmatter, PostSummary } from "./schema";
export type { TocItem } from "@/lib/markdown/toc";
