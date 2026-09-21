/**
 * Grid da listagem de posts (1 coluna no mobile, 2 em md, 3 em lg), com
 * estado vazio quando não há posts publicados.
 */
import { NewspaperIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PostCard } from "@/features/blog/components/molecules/post-card";
import type { PostCardModel } from "@/features/blog/domain/post-card";

interface BlogListProps {
  posts: readonly PostCardModel[];
  emptyState: { title: string; description: string };
}

export function BlogList({ posts, emptyState }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <NewspaperIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{emptyState.title}</EmptyTitle>
          <EmptyDescription>{emptyState.description}</EmptyDescription>
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
