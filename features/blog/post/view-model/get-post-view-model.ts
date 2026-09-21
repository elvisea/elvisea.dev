/**
 * View-model de `/blog/[slug]`: cabeçalho do post, sumário, corpo em HTML,
 * compartilhamento, trilha e JSON-LD. `null` para slug sem post publicado
 * (a rota responde 404). A metadata sai de `getPostMetadata`, que a rota
 * chama no `generateMetadata`, sem renderizar o Markdown.
 */
import type { Metadata } from "next";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import {
  type PostMetaModel,
  toPostMetaModel,
} from "@/features/blog/domain/post-meta";
import {
  blogRepository,
  type BlogRepository,
} from "@/features/blog/repository/blog-repository";
import { BLOG_PATH, linkedInShareUrl, postPath } from "@/features/blog/routes";
import type { TocItem } from "@/lib/markdown/toc";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  blogPostingNode,
  type BreadcrumbItem,
  type JsonLdNode,
} from "@/lib/seo/structured-data";

export interface PostViewModel {
  back: { href: string; label: string };
  header: {
    title: string;
    description: string;
    tags: readonly string[];
    coverImage?: string;
    meta: PostMetaModel;
  };
  toc: { label: string; items: readonly TocItem[] };
  /** Corpo do post em HTML, renderizado em build. */
  html: string;
  share: { href: string; label: string };
  breadcrumb: readonly BreadcrumbItem[];
  jsonLd: readonly JsonLdNode[];
}

export async function getPostMetadata(
  slug: string,
  repository: BlogRepository = blogRepository,
): Promise<Metadata> {
  const post = await repository.findBySlug(slug);
  if (!post) return {};
  const { title, description, date, updated, tags } = post.frontmatter;
  return pageMetadata({
    title,
    description,
    path: postPath(slug),
    article: { publishedTime: date, modifiedTime: updated, tags },
  });
}

export async function getPostViewModel(
  slug: string,
  repository: BlogRepository = blogRepository,
): Promise<PostViewModel | null> {
  const data = await repository.withHtml(slug);
  if (!data) return null;

  const { post, html, toc } = data;
  const { title, description, tags, coverImage } = post.frontmatter;

  return {
    back: { href: BLOG_PATH, label: blogPage.post.back },
    header: {
      title,
      description,
      tags,
      coverImage,
      meta: toPostMetaModel(post, blogPage.meta, {
        author: site.person.name,
        includeUpdated: true,
      }),
    },
    toc: { label: blogPage.post.toc, items: toc },
    html,
    share: {
      href: linkedInShareUrl(`${site.url}${postPath(slug)}`),
      label: blogPage.post.shareLinkedIn,
    },
    breadcrumb: [
      { name: blogPage.metaTitle, path: BLOG_PATH },
      { name: title, path: postPath(slug) },
    ],
    jsonLd: [blogPostingNode({ slug, ...post.frontmatter })],
  };
}

/** Texto da imagem OG do post (`opengraph-image.tsx`). */
export async function getPostOgModel(
  slug: string,
  repository: BlogRepository = blogRepository,
): Promise<{ eyebrow: string; title: string }> {
  const post = await repository.findBySlug(slug);
  return {
    eyebrow: `${blogPage.header.eyebrow} · ${blogPage.meta.readingTime(post?.readingMinutes ?? 1)}`,
    title: post?.frontmatter.title ?? blogPage.metaTitle,
  };
}
