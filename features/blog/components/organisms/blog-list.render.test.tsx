import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { toPostCardModel } from "@/features/blog/domain/post-card";
import type { PostSummary } from "@/features/blog/repository/schema";

import { BlogList } from "./blog-list";

const post = (slug: string): PostSummary => ({
  slug,
  frontmatter: {
    title: `Post ${slug}`,
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-10",
    tags: ["arquitetura"],
    draft: false,
  },
  readingMinutes: 4,
});

const cards = [post("a"), post("b")].map((p) =>
  toPostCardModel(p, { readMore: blogPage.card.readMore, meta: blogPage.meta }),
);

describe("BlogList", () => {
  it("sem posts, mostra o estado vazio em vez da grade", () => {
    render(<BlogList emptyState={blogPage.emptyState} posts={[]} />);
    expect(screen.getByText(blogPage.emptyState.title)).toBeInTheDocument();
    expect(
      screen.getByText(blogPage.emptyState.description),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("com posts, um item por post, com link do artigo", () => {
    render(<BlogList emptyState={blogPage.emptyState} posts={cards} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Post a" })).toHaveAttribute(
      "href",
      "/blog/a",
    );
    expect(screen.queryByText(blogPage.emptyState.title)).toBeNull();
  });
});
