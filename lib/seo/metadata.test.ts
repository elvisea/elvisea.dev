import { describe, expect, it } from "bun:test";

import { site } from "@/content/pt-BR/site";

import { pageMetadata, siteTitle } from "./metadata";

describe("pageMetadata", () => {
  it("usa título e descrição padrão quando a página não define", () => {
    const meta = pageMetadata({ path: "/" });
    expect(meta.title).toBeUndefined();
    expect(meta.description).toBe(site.description);
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: site.domain,
      locale: site.locale,
      url: "/",
      title: siteTitle,
    });
  });

  it("repete siteName e locale em páginas com título próprio", () => {
    const meta = pageMetadata({
      title: "Blog",
      description: "D",
      path: "/blog",
    });
    expect(meta.title).toBe("Blog");
    expect(meta.openGraph).toMatchObject({
      siteName: site.domain,
      locale: site.locale,
      title: `Blog · ${site.person.name}`,
      description: "D",
    });
  });

  it("marca artigos com data e autor", () => {
    const meta = pageMetadata({
      title: "Post",
      path: "/blog/post",
      article: { publishedTime: "2026-09-16", tags: ["a"] },
    });
    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-09-16",
      authors: [site.person.fullName],
      tags: ["a"],
    });
  });
});
