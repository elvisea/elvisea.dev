/**
 * View-model de `/blog`: cabeçalho, cards dos posts, estado vazio, trilha e
 * metadata. Sem posts publicados, a listagem fica fora do índice (e do
 * sitemap) até o primeiro post, sem mudança manual.
 */
import type { Metadata } from "next";

import { blogPage } from "@/content/pt-BR/pages/blog";
import {
  blogRepository,
  type BlogRepository,
} from "@/features/blog/repository/blog-repository";
import { BLOG_PATH } from "@/features/blog/routes";
import {
  type PostCardModel,
  toPostCardModel,
} from "@/features/blog/domain/post-card";
import { pageMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface BlogViewModel {
  header: typeof blogPage.header;
  cards: readonly PostCardModel[];
  emptyState: typeof blogPage.emptyState;
  breadcrumb: readonly BreadcrumbItem[];
  metadata: Metadata;
}

export function blogIndexMetadata(publishedPosts: number): Metadata {
  return {
    ...pageMetadata({
      title: blogPage.metaTitle,
      description: blogPage.metaDescription,
      path: BLOG_PATH,
    }),
    ...(publishedPosts === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function getBlogViewModel(
  repository: BlogRepository = blogRepository,
): Promise<BlogViewModel> {
  const posts = await repository.list();
  return {
    header: blogPage.header,
    cards: posts.map((post) =>
      toPostCardModel(post, {
        readMore: blogPage.card.readMore,
        meta: blogPage.meta,
      }),
    ),
    emptyState: blogPage.emptyState,
    breadcrumb: [{ name: blogPage.metaTitle, path: BLOG_PATH }],
    metadata: blogIndexMetadata(posts.length),
  };
}
