import { MonoLabel } from "@/components/atoms/mono-label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TocItem } from "@/lib/markdown/toc";
import { cn } from "cn";

interface PostTocProps {
  label: string;
  items: readonly TocItem[];
}

/** Sumário do post (só renderizado quando há seções suficientes). */
export function PostToc({ label, items }: PostTocProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label}>
      <Card>
        <CardHeader>
          <CardTitle>
            <MonoLabel>{label}</MonoLabel>
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
