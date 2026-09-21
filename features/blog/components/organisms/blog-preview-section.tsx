/**
 * Seção da home com os posts mais recentes e o link para a listagem. Os
 * cards chegam prontos: sem posts, a home não mostra a seção.
 */
import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/features/blog/components/molecules/post-card";
import type { PostCardModel } from "@/features/blog/domain/post-card";
import { cn } from "cn";

interface BlogPreviewSectionProps {
  eyebrow: string;
  title: string;
  posts: readonly PostCardModel[];
  viewAll: { href: string; label: string };
}

export function BlogPreviewSection({
  eyebrow,
  title,
  posts,
  viewAll,
}: BlogPreviewSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border bg-background py-20" id="blog">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-sm text-highlight">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight text-balance text-heading">
            {title}
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
            href={viewAll.href}
          >
            {viewAll.label}
            <ArrowRightIcon aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
