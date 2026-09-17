/**
 * Grid da página `/blog` (1 col mobile → 2 md → 3 lg), com estado vazio
 * quando não há posts publicados.
 */
import { NewspaperIcon } from "lucide-react";

import { PostCard } from "@/components/molecules/post-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { blogPage } from "@/content/pt-BR/pages/blog";
import type { PostSummary } from "@/lib/blog";

interface BlogListProps {
  posts: PostSummary[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <NewspaperIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{blogPage.emptyState.title}</EmptyTitle>
          <EmptyDescription>{blogPage.emptyState.description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
