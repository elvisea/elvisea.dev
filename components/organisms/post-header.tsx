/**
 * Cabeçalho do post (`<header>` dentro do `<article>` da rota): tags, título,
 * descrição, meta e capa opcional.
 */
import Image from "next/image";

import { PostMeta } from "@/components/molecules/post-meta";
import { Badge } from "@/components/ui/badge";
import type { PostSummary } from "@/lib/blog";

export function PostHeader({ post }: { post: PostSummary }) {
  const { title, description, tags, coverImage, date, updated } =
    post.frontmatter;

  return (
    <header className="space-y-6">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-balance text-heading md:text-4xl">
        {title}
      </h1>
      <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>
      <PostMeta
        date={date}
        readingMinutes={post.readingMinutes}
        showAuthor
        updated={updated}
      />
      {coverImage ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            alt={title}
            className="h-auto w-full"
            height={630}
            priority
            src={coverImage}
            width={1200}
          />
        </div>
      ) : null}
    </header>
  );
}
