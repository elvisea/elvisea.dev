import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { toPostCardModel } from "@/features/blog/domain/post-card";
import type { PostSummary } from "@/features/blog/repository/schema";

import { PostCard } from "./post-card";

const post: PostSummary = {
  slug: "meu-post",
  frontmatter: {
    title: "Meu post",
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-10",
    tags: ["nextjs", "arquitetura", "bun", "extra"],
    draft: false,
  },
  readingMinutes: 4,
};

const card = (summary: PostSummary = post) =>
  toPostCardModel(summary, {
    readMore: blogPage.card.readMore,
    meta: blogPage.meta,
  });

describe("PostCard", () => {
  it("título como link, data legível e tempo de leitura", () => {
    render(<PostCard post={card()} />);
    expect(screen.getByRole("link", { name: "Meu post" })).toHaveAttribute(
      "href",
      "/blog/meu-post",
    );
    expect(screen.getByText("10 de março de 2026")).toHaveAttribute(
      "datetime",
      "2026-03-10",
    );
    expect(screen.getByText(blogPage.meta.readingTime(4))).toBeInTheDocument();
  });

  it("mostra no máximo três tags", () => {
    render(<PostCard post={card()} />);
    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.queryByText("extra")).toBeNull();
  });

  it("link de leitura tem nome acessível com o título", () => {
    render(<PostCard post={card()} />);
    expect(
      screen.getByRole("link", {
        name: `${blogPage.card.readMore}: Meu post`,
      }),
    ).toHaveAttribute("href", "/blog/meu-post");
  });

  it("o card não mostra a data de atualização (só a página do post)", () => {
    render(
      <PostCard
        post={card({
          ...post,
          frontmatter: { ...post.frontmatter, updated: "2026-04-02" },
        })}
      />,
    );
    expect(screen.queryByText("2 de abril de 2026")).toBeNull();
  });
});
