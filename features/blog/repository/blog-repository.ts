/**
 * Porta de acesso aos posts: lê a fonte uma vez, filtra os rascunhos num
 * lugar só e devolve o que as telas usam.
 *
 * A fonte (`./source.ts`) e o pipeline de Markdown entram por parâmetro,
 * para os testes não dependerem do filesystem.
 *
 * Em produção (e no `next build`) a leitura é memoizada por instância:
 * lista, prévia, sitemap, RSS e páginas de post compartilham a mesma carga.
 * Fora de produção cada chamada relê os arquivos, para `next dev` mostrar um
 * post novo ou editado sem reiniciar o servidor.
 */
import "server-only";

import { renderMarkdown } from "@/lib/markdown/render";
import { extractToc, type TocItem } from "@/lib/markdown/toc";

import { readingMinutes } from "./reading-time";
import type { Post, PostSummary } from "./schema";
import { loadAllPostsFromFs } from "./source";

/** Sumário só aparece em posts com pelo menos esta quantidade de `h2`. */
export const TOC_MIN_SECTIONS = 3;

export interface PostWithHtml {
  post: PostSummary;
  html: string;
  /** Vazio quando o post tem menos de `TOC_MIN_SECTIONS` seções. */
  toc: TocItem[];
}

export interface BlogRepository {
  /** Posts publicados, do mais recente para o mais antigo. */
  list(): Promise<PostSummary[]>;
  /** Posts publicados e rascunhos (só o script de divulgação usa). */
  listAll(): Promise<PostSummary[]>;
  recent(limit: number): Promise<PostSummary[]>;
  slugs(): Promise<string[]>;
  findBySlug(slug: string): Promise<PostSummary | null>;
  withHtml(slug: string): Promise<PostWithHtml | null>;
}

interface BlogRepositoryDeps {
  render?: (markdown: string) => Promise<string>;
  toc?: (markdown: string) => TocItem[];
  tocMinSections?: number;
  /** Memoizar a leitura da fonte (padrão: só em produção). */
  cacheReads?: boolean;
}

const toSummary = ({ raw, ...rest }: Post): PostSummary => ({
  ...rest,
  readingMinutes: readingMinutes(raw),
});

export function createBlogRepository(
  loadPosts: () => Promise<Post[]>,
  {
    render = renderMarkdown,
    toc = extractToc,
    tocMinSections = TOC_MIN_SECTIONS,
    cacheReads = process.env.NODE_ENV === "production",
  }: BlogRepositoryDeps = {},
): BlogRepository {
  let loaded: Promise<Post[]> | undefined;
  const all = () => (cacheReads ? (loaded ??= loadPosts()) : loadPosts());
  const published = async () =>
    (await all()).filter((post) => !post.frontmatter.draft);

  const list = async () => (await published()).map(toSummary);

  return {
    list,
    listAll: async () => (await all()).map(toSummary),
    recent: async (limit) => (await list()).slice(0, limit),
    slugs: async () => (await published()).map((post) => post.slug),
    findBySlug: async (slug) =>
      (await list()).find((post) => post.slug === slug) ?? null,
    withHtml: async (slug) => {
      const post = (await published()).find((item) => item.slug === slug);
      if (!post) return null;
      const items = toc(post.raw);
      const sections = items.filter((item) => item.depth === 2).length;
      return {
        post: toSummary(post),
        html: await render(post.raw),
        toc: sections >= tocMinSections ? items : [],
      };
    },
  };
}

/** Repository com os arquivos de `content/pt-BR/blog/posts`. */
export const blogRepository = createBlogRepository(loadAllPostsFromFs);

export type { Post, PostFrontmatter, PostSummary } from "./schema";
export type { TocItem } from "@/lib/markdown/toc";
