/**
 * Imagem OG de cada post (1200×630), gerada em build. É a prévia que aparece
 * quando o link do post é compartilhado no LinkedIn.
 */
import { ImageResponse } from "next/og";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { OgCard, OG_SIZE } from "@/lib/og/card";
import { loadOgFonts } from "@/lib/og/fonts";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.frontmatter.title ?? blogPage.metaTitle;

  return new ImageResponse(
    <OgCard
      eyebrow={`${blogPage.header.eyebrow} · ${blogPage.meta.readingTime(post?.readingMinutes ?? 1)}`}
      title={title}
    />,
    { ...size, fonts: await loadOgFonts() },
  );
}
