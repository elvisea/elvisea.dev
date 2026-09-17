/**
 * Data, tempo de leitura e autor de um post.
 *
 * `timeZone: "UTC"` + `Date.UTC` evitam o "dia anterior" ao formatar datas
 * `YYYY-MM-DD` em fusos a oeste de UTC. `<time dateTime>` guarda o ISO.
 */
import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import { cn } from "cn";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatIsoDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

interface PostMetaProps {
  date: string;
  updated?: string;
  readingMinutes: number;
  showAuthor?: boolean;
  className?: string;
}

export function PostMeta({
  date,
  updated,
  readingMinutes,
  showAuthor = false,
  className,
}: PostMetaProps) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <time dateTime={date}>{formatIsoDate(date)}</time>
      {updated ? (
        <>
          <span aria-hidden>·</span>
          <span>
            {blogPage.meta.updated}{" "}
            <time dateTime={updated}>{formatIsoDate(updated)}</time>
          </span>
        </>
      ) : null}
      <span aria-hidden>·</span>
      <span>{blogPage.meta.readingTime(readingMinutes)}</span>
      {showAuthor ? (
        <>
          <span aria-hidden>·</span>
          <span>
            {blogPage.meta.by} {site.person.name}
          </span>
        </>
      ) : null}
    </p>
  );
}
