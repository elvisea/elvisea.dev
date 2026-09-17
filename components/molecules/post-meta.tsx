/**
 * Molécula que exibe data + autor de um post.
 *
 * `timeZone: "UTC"` no formatter + parse manual via `Date.UTC` evita o
 * "drift de um dia" típico quando se renderiza data do tipo `YYYY-MM-DD`
 * em fusos a oeste de UTC. A `<time dateTime>` carrega o ISO original
 * para preservar semântica e SEO.
 */
import { blogPage } from "@/content/pt-BR/pages/blog";
import { cn } from "cn";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

interface PostMetaProps {
  date: string;
  author: string;
  className?: string;
}

/**
 * @param date Data ISO no formato `YYYY-MM-DD` (vindo de `frontmatter.date`).
 * @param author Nome a exibir após "Por".
 */
export function PostMeta({ date, author, className }: PostMetaProps) {
  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <time dateTime={date}>{dateFormatter.format(dateObj)}</time>
      <span aria-hidden>·</span>
      <span>
        {blogPage.meta.by} {author}
      </span>
    </p>
  );
}
