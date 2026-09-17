/**
 * Grid responsivo da página `/blog` (1 col mobile → 2 md → 3 lg) com
 * empty state quando `posts` está vazio.
 *
 * Recebe os posts via prop (em vez de buscar internamente) para que a
 * página possa decidir filtros/paginação no futuro sem mudar a lista.
 */
import { PostCard } from "@/components/molecules/post-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blogPage } from "@/content/pt-BR/pages/blog";
import type { PostSummary } from "@/lib/blog";

interface BlogListProps {
  posts: PostSummary[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl text-heading">
            {blogPage.emptyState.title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {blogPage.emptyState.description}
          </CardDescription>
        </CardHeader>
      </Card>
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
