/**
 * Rota `/blog/[slug]`: um post por página, gerado em build.
 * `dynamicParams = false`: slug inexistente ou rascunho responde 404.
 */
import { notFound } from "next/navigation";

import { blogRepository } from "@/features/blog/repository/blog-repository";
import {
  getPostMetadata,
  getPostViewModel,
} from "@/features/blog/post/view-model/get-post-view-model";
import { PostView } from "@/features/blog/post/view/post-view";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blogRepository.slugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return getPostMetadata((await params).slug);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const model = await getPostViewModel((await params).slug);
  if (!model) notFound();
  return <PostView model={model} />;
}
