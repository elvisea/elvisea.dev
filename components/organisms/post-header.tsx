/**
 * Cabeçalho semântico do post (`<header>`) com tags, título, descrição,
 * meta (data + autor) e cover opcional.
 *
 * Renderiza dentro do `<article>` da rota `/blog/[slug]/page.tsx` —
 * por isso usa `<header>`, não `<section>`, para manter outline correto.
 *
 * Cover renderizada com `next/image` priority + dimensões fixas (1200×630)
 * para evitar CLS. Imagens em `/public/blog/`.
 */
import Image from "next/image";

import { PostMeta } from "@/components/molecules/post-meta";
import { Badge } from "@/components/ui/badge";
import type { PostFrontmatter } from "@/lib/blog";

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
}

export function PostHeader({ frontmatter }: PostHeaderProps) {
  const { title, description, tags, coverImage, date, author } = frontmatter;

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
      <h1 className="text-balance text-3xl font-bold tracking-tight text-heading md:text-4xl">
        {title}
      </h1>
      <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
        {description}
      </p>
      <PostMeta date={date} author={author} />
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
