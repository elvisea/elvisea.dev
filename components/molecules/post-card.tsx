/**
 * Cartão de pré-visualização de um post — título, descrição, tags e CTA.
 *
 * Usado tanto pela `BlogList` (página `/blog`) quanto pela
 * `BlogPreviewSection` (home). Recebe `PostSummary` (sem o corpo
 * markdown) para evitar enviar conteúdo desnecessário ao client.
 *
 * Tags são truncadas em 3 — listas longas viram poluição visual no card.
 */
import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { PostMeta } from "@/components/molecules/post-meta";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blogPage } from "@/content/pt-BR/pages/blog";
import type { PostSummary } from "@/lib/blog";

interface PostCardProps {
  post: PostSummary;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;
  const href = `/blog/${slug}`;

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        {frontmatter.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <CardTitle className="text-xl text-heading">
          <Link className="underline-offset-4 hover:underline" href={href}>
            {frontmatter.title}
          </Link>
        </CardTitle>
        <PostMeta
          date={frontmatter.date}
          readingMinutes={post.readingMinutes}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {frontmatter.description}
        </CardDescription>
        <Link
          aria-label={`${blogPage.card.readMore}: ${frontmatter.title}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          href={href}
        >
          {blogPage.card.readMore}
          <ArrowRightIcon aria-hidden className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
