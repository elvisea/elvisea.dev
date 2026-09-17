/**
 * Fachada pública do sistema de blog — **único ponto de import** para
 * rotas e componentes (`@/lib/blog`).
 *
 * Toda função é envolvida em `React.cache` para que múltiplos consumidores
 * dentro do mesmo request (lista + preview + sitemap, por exemplo)
 * compartilhem o resultado da leitura do filesystem em vez de relê-lo.
 *
 * Filtragem de drafts (`frontmatter.draft === true`) acontece **aqui** —
 * a camada de fonte (`./source.ts`) devolve posts crus para que testes
 * possam validar o filtro separadamente.
 *
 * @module lib/blog
 */
import "server-only";
import { cache } from "react";

import { renderMarkdown } from "./markdown";
import { loadAllPostsFromFs } from "./source";

/**
 * Todos os posts publicados (drafts removidos), ordenados por data desc.
 * Use em `/blog` (lista completa) e como base para os outros helpers.
 */
export const getAllPosts = cache(async () => {
  const all = await loadAllPostsFromFs();
  return all.filter((p) => !p.frontmatter.draft);
});

/**
 * Os `n` posts mais recentes. Padrão `n = 3`, consumido pela
 * `BlogPreviewSection` na home.
 *
 * Como `React.cache` chaveia por argumentos, `getRecentPosts()` e
 * `getRecentPosts(3)` ocupam **entradas distintas** no cache do request
 * (mesmo computando o mesmo resultado). Para evitar duplicidade,
 * padronize a chamada — ou sempre com argumento, ou sempre sem.
 */
export const getRecentPosts = cache(async (n = 3) =>
  (await getAllPosts()).slice(0, n),
);

/**
 * Busca o post por slug ou retorna `null` se não existir.
 * Usado em `/blog/[slug]/page.tsx` antes de chamar `notFound()`.
 */
export const getPostBySlug = cache(
  async (slug: string) =>
    (await getAllPosts()).find((p) => p.slug === slug) ?? null,
);

/**
 * Lista de slugs publicados — alimenta `generateStaticParams`
 * em `/blog/[slug]/page.tsx` e o `app/sitemap.ts`.
 */
export const getAllSlugs = cache(async () =>
  (await getAllPosts()).map((p) => p.slug),
);

/**
 * Carrega o post pelo slug e renderiza o corpo markdown em HTML estático.
 * Reúne `getPostBySlug` + `renderMarkdown` para que rotas/componentes
 * só dependam de `@/lib/blog`, sem reachar a camada interna de transformação.
 *
 * Retorna `null` quando o slug não existe (mesmo contrato de
 * `getPostBySlug`).
 */
export const getPostWithHtml = cache(async (slug: string) => {
  const post = await getPostBySlug(slug);
  if (!post) return null;
  const html = await renderMarkdown(post.raw);
  return { post, html };
});

export type { Post, PostFrontmatter, PostSummary } from "./schema";
