/**
 * Cartão de pré-visualização de um post: tags, título, meta, descrição e
 * link de leitura. Usado na listagem `/blog` e na prévia da home.
 */
import Link from "next/link";

import { ArrowLink } from "@/components/atoms/arrow-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostMeta } from "@/features/blog/components/molecules/post-meta";
import type { PostCardModel } from "@/features/blog/domain/post-card";

export function PostCard({ post }: { post: PostCardModel }) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <CardTitle className="text-xl text-heading">
          <Link className="underline-offset-4 hover:underline" href={post.href}>
            {post.title}
          </Link>
        </CardTitle>
        <PostMeta meta={post.meta} />
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {post.description}
        </CardDescription>
        <ArrowLink
          aria-label={post.readMore.ariaLabel}
          className="min-h-0"
          href={post.href}
          size="sm"
        >
          {post.readMore.label}
        </ArrowLink>
      </CardContent>
    </Card>
  );
}
