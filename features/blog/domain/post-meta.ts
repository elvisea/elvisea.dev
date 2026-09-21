/**
 * Data, tempo de leitura e autor de um post, já em texto.
 *
 * `timeZone: "UTC"` + `Date.UTC` evitam o "dia anterior" ao formatar datas
 * `YYYY-MM-DD` em fusos a oeste de UTC.
 */
import type { PostSummary } from "@/features/blog/repository/schema";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatIsoDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(year!, month! - 1, day!)));
}

export interface PostMetaTexts {
  updated: string;
  by: string;
  readingTime: (minutes: number) => string;
}

export interface PostDate {
  /** Valor do atributo `datetime`. */
  iso: string;
  label: string;
}

export interface PostMetaModel {
  date: PostDate;
  /** Rótulo e data da atualização, ou `null` quando o post não foi atualizado. */
  updated: { prefix: string; date: PostDate } | null;
  readingTime: string;
  /** Autor, só na página do post. Rótulo e nome separados, como no HTML. */
  author: { prefix: string; name: string } | null;
}

interface PostMetaOptions {
  /** Nome do autor; sem ele, a linha não aparece (card da listagem). */
  author?: string;
  /** A data de atualização só aparece na página do post. */
  includeUpdated?: boolean;
}

export function toPostMetaModel(
  post: PostSummary,
  texts: PostMetaTexts,
  { author, includeUpdated = false }: PostMetaOptions = {},
): PostMetaModel {
  const { date, updated } = post.frontmatter;
  return {
    date: { iso: date, label: formatIsoDate(date) },
    updated:
      includeUpdated && updated
        ? {
            prefix: texts.updated,
            date: { iso: updated, label: formatIsoDate(updated) },
          }
        : null,
    readingTime: texts.readingTime(post.readingMinutes),
    author: author ? { prefix: texts.by, name: author } : null,
  };
}
