import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPage } from "@/content/pt-BR/pages/blog";
import type { TocItem } from "@/lib/blog";
import { cn } from "cn";

/** Sumário do post (só renderizado quando há seções suficientes). */
export function PostToc({ items }: { items: readonly TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={blogPage.post.toc}>
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-xs tracking-wide text-highlight uppercase">
            {blogPage.post.toc}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1.5 text-sm">
            {items.map((item) => (
              <li key={item.id} className={cn(item.depth === 3 && "pl-4")}>
                <a
                  className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  href={`#${item.id}`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </nav>
  );
}
