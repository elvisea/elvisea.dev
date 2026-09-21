import { describe, expect, it, mock } from "bun:test";

import type { TocItem } from "@/lib/markdown/toc";

import { createBlogRepository, TOC_MIN_SECTIONS } from "./blog-repository";
import type { Post } from "./schema";

function post(
  slug: string,
  extra: Partial<Post["frontmatter"]> = {},
  raw = "Texto do post.",
): Post {
  return {
    slug,
    frontmatter: {
      title: `Post ${slug}`,
      description: "Descrição com tamanho suficiente para o schema do post.",
      date: "2026-01-01",
      tags: [],
      draft: false,
      ...extra,
    },
    raw,
  };
}

const posts = [
  post("recente", { date: "2026-03-01" }),
  post("antigo", { date: "2026-01-01" }),
  post("rascunho", { draft: true }),
];

function repository(deps = {}, source = posts) {
  const loadPosts = mock(async () => source);
  return {
    loadPosts,
    repo: createBlogRepository(loadPosts, { cacheReads: true, ...deps }),
  };
}

describe("createBlogRepository", () => {
  it("lista só os publicados, na ordem da fonte, com tempo de leitura", async () => {
    const { repo } = repository();
    const list = await repo.list();
    expect(list.map((p) => p.slug)).toEqual(["recente", "antigo"]);
    expect(list[0]?.readingMinutes).toBe(1);
    expect(list[0]).not.toHaveProperty("raw");
  });

  it("fora de produção, cada consulta relê a fonte (post novo em dev)", async () => {
    const loadPosts = mock(async () => posts);
    const repo = createBlogRepository(loadPosts, { cacheReads: false });
    await repo.list();
    await repo.slugs();
    expect(loadPosts).toHaveBeenCalledTimes(2);
  });

  it("lê a fonte uma vez, mesmo com várias consultas", async () => {
    const { repo, loadPosts } = repository();
    await Promise.all([repo.list(), repo.slugs(), repo.recent(1)]);
    await repo.withHtml("recente");
    expect(loadPosts).toHaveBeenCalledTimes(1);
  });

  it("recent, slugs e findBySlug ignoram rascunho", async () => {
    const { repo } = repository();
    expect((await repo.recent(1)).map((p) => p.slug)).toEqual(["recente"]);
    expect(await repo.slugs()).toEqual(["recente", "antigo"]);
    expect(await repo.findBySlug("rascunho")).toBeNull();
    expect((await repo.findBySlug("antigo"))?.frontmatter.title).toBe(
      "Post antigo",
    );
  });

  it("listAll inclui rascunhos (divulgação)", async () => {
    const { repo } = repository();
    expect((await repo.listAll()).map((p) => p.slug)).toEqual([
      "recente",
      "antigo",
      "rascunho",
    ]);
  });

  it("withHtml renderiza o corpo e devolve o sumário com seções suficientes", async () => {
    const items: TocItem[] = Array.from(
      { length: TOC_MIN_SECTIONS },
      (_, i) => ({
        id: `s${i}`,
        text: `Seção ${i}`,
        depth: 2,
      }),
    );
    const { repo } = repository({
      render: async (markdown: string) => `<p>${markdown}</p>`,
      toc: () => items,
    });
    const data = await repo.withHtml("recente");
    expect(data?.html).toBe("<p>Texto do post.</p>");
    expect(data?.toc).toEqual(items);
    expect(data?.post.slug).toBe("recente");
  });

  it("sumário fica vazio com poucas seções, e rascunho responde null", async () => {
    const { repo } = repository({
      render: async () => "<p>x</p>",
      toc: () => [{ id: "a", text: "A", depth: 2 }],
    });
    expect((await repo.withHtml("recente"))?.toc).toEqual([]);
    expect(await repo.withHtml("rascunho")).toBeNull();
  });
});
