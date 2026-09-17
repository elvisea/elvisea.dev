/**
 * Seção da home (`app/page.tsx`) com os 3 posts mais recentes + CTA "Ver
 * todos". RSC assíncrono — busca via `getRecentPosts(3)` em build time.
 *
 * Renderiza `null` quando ainda não há posts publicados (evita seção
 * vazia na home).
 *
 */
import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { PostCard } from "@/components/molecules/post-card";
import { buttonVariants } from "@/components/ui/button";
import { blogPage } from "@/content/pt-BR/pages/blog";
import { getRecentPosts } from "@/lib/blog";
import { cn } from "cn";

export async function BlogPreviewSection() {
  const posts = await getRecentPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border bg-background py-20" id="blog">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-sm text-highlight">
            {blogPage.preview.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-balance text-heading">
            {blogPage.preview.title}
          </h2>
        </div>

        <ul className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>

        <div className="flex">
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2",
            )}
            href="/blog"
          >
            {blogPage.preview.viewAll}
            <ArrowRightIcon aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
