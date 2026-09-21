import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { getBlogViewModel } from "@/features/blog/list/view-model/get-blog-view-model";
import type { BlogRepository } from "@/features/blog/repository/blog-repository";
import type { PostSummary } from "@/features/blog/repository/schema";

import { BlogView } from "./blog-view";

const post: PostSummary = {
  slug: "a",
  frontmatter: {
    title: "Post a",
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-10",
    tags: [],
    draft: false,
  },
  readingMinutes: 2,
};

const repository = (posts: PostSummary[]) =>
  ({ list: async () => posts }) as unknown as BlogRepository;

describe("BlogView", () => {
  it("abre com o h1 do blog e lista os posts", async () => {
    render(<BlogView model={await getBlogViewModel(repository([post]))} />);
    expect(
      screen.getByRole("heading", { level: 1, name: blogPage.header.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Post a" })).toBeInTheDocument();
  });

  it("sem posts, mostra o estado vazio", async () => {
    render(<BlogView model={await getBlogViewModel(repository([]))} />);
    expect(screen.getByText(blogPage.emptyState.title)).toBeInTheDocument();
  });
});
