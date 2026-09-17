/**
 * Metadata da rota `/blog`, usada pelo `generateMetadata` de `app/blog/page.tsx`.
 * Metadata por post fica no `generateMetadata` de `app/blog/[slug]/page.tsx`.
 *
 * Sem posts publicados, a listagem é uma página vazia: fica fora do índice
 * (e do sitemap) até o primeiro post, sem mudança manual.
 */
import type { Metadata } from "next";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { pageMetadata } from "@/lib/seo/metadata";

export function blogIndexMetadata(publishedPosts: number): Metadata {
  return {
    ...pageMetadata({
      title: blogPage.metaTitle,
      description: blogPage.metaDescription,
      path: "/blog",
    }),
    ...(publishedPosts === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}
