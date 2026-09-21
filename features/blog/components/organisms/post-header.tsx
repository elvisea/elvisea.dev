/**
 * Cabeçalho do post (`<header>` dentro do `<article>`): tags, título,
 * descrição, meta e capa opcional.
 */
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PostMeta } from "@/features/blog/components/molecules/post-meta";
import type { PostViewModel } from "@/features/blog/post/view-model/get-post-view-model";

export function PostHeader({ header }: { header: PostViewModel["header"] }) {
  return (
    <header className="space-y-6">
      {header.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {header.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-balance text-heading md:text-4xl">
        {header.title}
      </h1>
      <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
        {header.description}
      </p>
      <PostMeta meta={header.meta} />
      {header.coverImage ? (
        <Card className="py-0">
          <Image
            alt={header.title}
            className="h-auto w-full"
            height={630}
            priority
            src={header.coverImage}
            width={1200}
          />
        </Card>
      ) : null}
    </header>
  );
}
