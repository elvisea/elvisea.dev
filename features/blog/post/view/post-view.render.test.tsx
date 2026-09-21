import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { blogPage } from "@/content/pt-BR/pages/blog";
import type { PostViewModel } from "@/features/blog/post/view-model/get-post-view-model";

import { PostView } from "./post-view";

const model: PostViewModel = {
  back: { href: "/blog", label: blogPage.post.back },
  header: {
    title: "Meu post",
    description: "Descrição do post.",
    tags: ["nextjs"],
    meta: {
      date: { iso: "2026-03-10", label: "10 de março de 2026" },
      updated: null,
      readingTime: blogPage.meta.readingTime(4),
      author: { prefix: blogPage.meta.by, name: "Elvis Amancio" },
    },
  },
  toc: {
    label: blogPage.post.toc,
    items: [{ id: "seção", text: "Seção", depth: 2 }],
  },
  html: "<p>corpo do post</p>",
  share: {
    href: "https://www.linkedin.com/sharing/x",
    label: blogPage.post.shareLinkedIn,
  },
  breadcrumb: [
    { name: blogPage.metaTitle, path: "/blog" },
    { name: "Meu post", path: "/blog/meu-post" },
  ],
  jsonLd: [],
};

describe("PostView", () => {
  it("volta para a listagem, h1 do post, autor e corpo", () => {
    render(<PostView model={model} />);
    expect(
      screen.getByRole("link", { name: blogPage.post.back }),
    ).toHaveAttribute("href", "/blog");
    expect(
      screen.getByRole("heading", { level: 1, name: "Meu post" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${blogPage.meta.by} Elvis Amancio`),
    ).toBeInTheDocument();
    expect(screen.getByText("corpo do post")).toBeInTheDocument();
  });

  it("sumário com as seções e compartilhamento em nova aba", () => {
    render(<PostView model={model} />);
    const toc = screen.getByRole("navigation", { name: blogPage.post.toc });
    expect(toc).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seção" })).toHaveAttribute(
      "href",
      "#seção",
    );
    const share = screen.getByRole("link", {
      name: blogPage.post.shareLinkedIn,
    });
    expect(share).toHaveAttribute("target", "_blank");
    expect(share).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sem seções suficientes, o sumário não aparece", () => {
    render(<PostView model={{ ...model, toc: { ...model.toc, items: [] } }} />);
    expect(
      screen.queryByRole("navigation", { name: blogPage.post.toc }),
    ).toBeNull();
  });
});
