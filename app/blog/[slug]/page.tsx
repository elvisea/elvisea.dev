/**
 * Rota `/blog/[slug]`: um post por página, gerado em build (SSG).
 *
 * `dynamicParams = false`: slug fora de `generateStaticParams` (inexistente
 * ou draft) responde 404, sem renderização dinâmica.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";

import { PostToc } from "@/components/molecules/post-toc";
import { PostBody } from "@/components/organisms/post-body";
import { PostHeader } from "@/components/organisms/post-header";
import { Separator } from "@/components/ui/separator";
import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import { getAllSlugs, getPostBySlug, getPostWithHtml } from "@/lib/blog";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { blogPostingNode } from "@/lib/seo/structured-data";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

/** Metadata do post: canonical e OG de artigo. A imagem vem do opengraph-image.tsx. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { title, description, date, updated, tags } = post.frontmatter;
  return pageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    article: { publishedTime: date, modifiedTime: updated, tags },
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

  const { post, html, toc } = data;
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/blog/${slug}`)}`;

  return (
    <article className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <PageJsonLd
        breadcrumb={[
          { name: blogPage.metaTitle, path: "/blog" },
          { name: post.frontmatter.title, path: `/blog/${slug}` },
        ]}
        nodes={[blogPostingNode({ slug, ...post.frontmatter })]}
      />
      <Link
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        href="/blog"
      >
        <ArrowLeftIcon aria-hidden className="size-4" />
        {blogPage.post.back}
      </Link>
      <PostHeader post={post} />
      <PostToc items={toc} />
      <PostBody html={html} />
      <footer className="space-y-6">
        <Separator />
        <a
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          href={shareUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {blogPage.post.shareLinkedIn}
          <ArrowUpRightIcon aria-hidden className="size-4" />
        </a>
      </footer>
    </article>
  );
}
