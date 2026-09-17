/**
 * Rota `/blog/[slug]` — página individual de cada post (SSG).
 *
 * `dynamicParams = false` faz qualquer slug fora do conjunto de
 * `generateStaticParams` retornar 404 — sem fallback dinâmico, sem
 * surpresa em produção.
 *
 * Fluxo:
 * 1. `generateStaticParams` lista todos os slugs publicados em build.
 * 2. `generateMetadata` resolve title/description/OG/canonical por post.
 * 3. `BlogPostPage` carrega frontmatter + corpo, renderiza markdown
 *    para HTML estático e injeta em `PostBody`.
 *
 * Se o slug não existir (caso defensivo, já barrado por `dynamicParams`),
 * `notFound()` lança e o Next entrega o `not-found.tsx` global.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostBody } from "@/components/organisms/post-body";
import { PostHeader } from "@/components/organisms/post-header";
import { getAllSlugs, getPostBySlug, getPostWithHtml } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

/** Lista de `{ slug }` consumida pelo Next para pré-renderizar cada post. */
export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

/** Metadata por post a partir do frontmatter (canonical, OG de artigo). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { title, description, date, tags } = post.frontmatter;
  return pageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    article: { publishedTime: date, tags },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostWithHtml(slug);
  if (!data) notFound();

  const { post, html } = data;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <PostHeader frontmatter={post.frontmatter} />
      <div className="mt-10">
        <PostBody html={html} />
      </div>
    </article>
  );
}
