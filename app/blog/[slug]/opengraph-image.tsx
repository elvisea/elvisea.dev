/**
 * Imagem OG de cada post (1200×630), gerada em build. É a prévia que aparece
 * quando o link do post é compartilhado no LinkedIn.
 */
import { ImageResponse } from "next/og";

import {
  OG_SIZE,
  OgCardTemplate,
} from "@/components/templates/og-card-template";
import { site } from "@/content/pt-BR/site";
import { getPostOgModel } from "@/features/blog/post/view-model/get-post-view-model";
import { blogRepository } from "@/features/blog/repository/blog-repository";
import { loadOgFonts } from "@/lib/og/fonts";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blogRepository.slugs()).map((slug) => ({ slug }));
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const model = await getPostOgModel((await params).slug);

  return new ImageResponse(
    <OgCardTemplate
      author={site.person.fullName}
      domain={site.domain}
      eyebrow={model.eyebrow}
      title={model.title}
    />,
    { ...size, fonts: await loadOgFonts() },
  );
}
