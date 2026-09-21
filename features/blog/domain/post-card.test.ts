import { describe, expect, it } from "bun:test";

import { blogPage } from "@/content/pt-BR/pages/blog";
import type { PostSummary } from "@/features/blog/repository/schema";

import { toPostCardModel } from "./post-card";
import { toPostMetaModel } from "./post-meta";

const post: PostSummary = {
  slug: "primeiro-post",
  frontmatter: {
    title: "Primeiro post",
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-10",
    tags: ["a", "b", "c", "d"],
    draft: false,
  },
  readingMinutes: 4,
};

const texts = { readMore: blogPage.card.readMore, meta: blogPage.meta };

describe("toPostCardModel", () => {
  it("monta link, textos e no máximo três tags", () => {
    const model = toPostCardModel(post, texts);
    expect(model.href).toBe("/blog/primeiro-post");
    expect(model.title).toBe("Primeiro post");
    expect(model.tags).toEqual(["a", "b", "c"]);
    expect(model.readMore).toEqual({
      label: blogPage.card.readMore,
      ariaLabel: `${blogPage.card.readMore}: Primeiro post`,
    });
  });
});

describe("toPostMetaModel", () => {
  it("formata a data em pt-BR sem trocar o dia por fuso", () => {
    const meta = toPostMetaModel(post, blogPage.meta);
    expect(meta.date).toEqual({
      iso: "2026-03-10",
      label: "10 de março de 2026",
    });
    expect(meta.readingTime).toBe(blogPage.meta.readingTime(4));
    expect(meta.updated).toBeNull();
    expect(meta.author).toBeNull();
  });

  it("na página do post, traz a atualização e o autor", () => {
    const meta = toPostMetaModel(
      { ...post, frontmatter: { ...post.frontmatter, updated: "2026-04-02" } },
      blogPage.meta,
      { author: "Elvis Amancio", includeUpdated: true },
    );
    expect(meta.updated).toEqual({
      prefix: blogPage.meta.updated,
      date: { iso: "2026-04-02", label: "2 de abril de 2026" },
    });
    expect(meta.author).toEqual({
      prefix: blogPage.meta.by,
      name: "Elvis Amancio",
    });
  });

  it("no card, a atualização não aparece", () => {
    const meta = toPostMetaModel(
      { ...post, frontmatter: { ...post.frontmatter, updated: "2026-04-02" } },
      blogPage.meta,
    );
    expect(meta.updated).toBeNull();
  });
});
