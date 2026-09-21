import { describe, expect, it } from "bun:test";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import type {
  BlogRepository,
  PostWithHtml,
} from "@/features/blog/repository/blog-repository";
import type { PostSummary } from "@/features/blog/repository/schema";

import {
  getPostMetadata,
  getPostOgModel,
  getPostViewModel,
} from "./get-post-view-model";

const post: PostSummary = {
  slug: "meu-post",
  frontmatter: {
    title: "Meu post",
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-10",
    updated: "2026-04-01",
    tags: ["nextjs"],
    draft: false,
  },
  readingMinutes: 5,
};

const data: PostWithHtml = {
  post,
  html: "<p>corpo</p>",
  toc: [{ id: "s1", text: "Seção", depth: 2 }],
};

const repository = {
  findBySlug: async (slug: string) => (slug === "meu-post" ? post : null),
  withHtml: async (slug: string) => (slug === "meu-post" ? data : null),
} as unknown as BlogRepository;

describe("getPostViewModel", () => {
  it("monta cabeçalho, sumário, corpo e compartilhamento", async () => {
    const model = await getPostViewModel("meu-post", repository);
    expect(model?.back).toEqual({ href: "/blog", label: blogPage.post.back });
    expect(model?.header.title).toBe("Meu post");
    expect(model?.header.meta.author).toEqual({
      prefix: blogPage.meta.by,
      name: site.person.name,
    });
    expect(model?.header.meta.updated?.date.iso).toBe("2026-04-01");
    expect(model?.toc).toEqual({ label: blogPage.post.toc, items: data.toc });
    expect(model?.html).toBe("<p>corpo</p>");
    expect(model?.share.href).toContain(
      encodeURIComponent(`${site.url}/blog/meu-post`),
    );
  });

  it("trilha e JSON-LD do artigo", async () => {
    const model = await getPostViewModel("meu-post", repository);
    expect(model?.breadcrumb).toEqual([
      { name: blogPage.metaTitle, path: "/blog" },
      { name: "Meu post", path: "/blog/meu-post" },
    ]);
    expect(model?.jsonLd[0]).toMatchObject({
      "@type": "BlogPosting",
      headline: "Meu post",
      datePublished: "2026-03-10",
      dateModified: "2026-04-01",
    });
  });

  it("slug sem post publicado devolve null", async () => {
    expect(await getPostViewModel("rascunho", repository)).toBeNull();
  });
});

describe("getPostMetadata", () => {
  it("canonical e OG de artigo", async () => {
    const metadata = await getPostMetadata("meu-post", repository);
    expect(metadata.alternates?.canonical).toBe("/blog/meu-post");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-03-10",
      modifiedTime: "2026-04-01",
    });
  });

  it("slug desconhecido devolve metadata vazia", async () => {
    expect(await getPostMetadata("nada", repository)).toEqual({});
  });
});

describe("getPostOgModel", () => {
  it("usa título e tempo de leitura do post", async () => {
    expect(await getPostOgModel("meu-post", repository)).toEqual({
      eyebrow: `${blogPage.header.eyebrow} · ${blogPage.meta.readingTime(5)}`,
      title: "Meu post",
    });
  });

  it("sem post, cai no título do blog", async () => {
    expect(await getPostOgModel("nada", repository)).toEqual({
      eyebrow: `${blogPage.header.eyebrow} · ${blogPage.meta.readingTime(1)}`,
      title: blogPage.metaTitle,
    });
  });
});
