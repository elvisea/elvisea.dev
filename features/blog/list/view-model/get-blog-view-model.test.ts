import { describe, expect, it } from "bun:test";

import { blogPage } from "@/content/pt-BR/pages/blog";
import type { BlogRepository } from "@/features/blog/repository/blog-repository";
import type { PostSummary } from "@/features/blog/repository/schema";

import { blogIndexMetadata, getBlogViewModel } from "./get-blog-view-model";

const post = (slug: string): PostSummary => ({
  slug,
  frontmatter: {
    title: `Post ${slug}`,
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-01",
    tags: [],
    draft: false,
  },
  readingMinutes: 3,
});

const repository = (posts: PostSummary[]) =>
  ({ list: async () => posts }) as unknown as BlogRepository;

describe("blogIndexMetadata", () => {
  it("usa título, descrição e canonical do blog", () => {
    const metadata = blogIndexMetadata(2);
    expect(metadata.title).toBe(blogPage.metaTitle);
    expect(metadata.description).toBe(blogPage.metaDescription);
    expect(metadata.alternates?.canonical).toBe("/blog");
  });

  it("sem posts, a listagem sai do índice mas os links são seguidos", () => {
    expect(blogIndexMetadata(0).robots).toEqual({ index: false, follow: true });
    expect(blogIndexMetadata(1).robots).toBeUndefined();
  });
});

describe("getBlogViewModel", () => {
  it("um card por post publicado, com trilha e metadata", async () => {
    const model = await getBlogViewModel(repository([post("a"), post("b")]));
    expect(model.cards.map((card) => card.slug)).toEqual(["a", "b"]);
    expect(model.cards[0]?.href).toBe("/blog/a");
    expect(model.breadcrumb).toEqual([
      { name: blogPage.metaTitle, path: "/blog" },
    ]);
    expect(model.metadata.robots).toBeUndefined();
  });

  it("sem posts, entrega o estado vazio e o noindex", async () => {
    const model = await getBlogViewModel(repository([]));
    expect(model.cards).toHaveLength(0);
    expect(model.emptyState).toBe(blogPage.emptyState);
    expect(model.metadata.robots).toEqual({ index: false, follow: true });
  });
});
