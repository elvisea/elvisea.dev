import { describe, expect, it } from "bun:test";

import { buildRssFeed, type RssChannel, type RssItem } from "./build-rss-feed";

const channel: RssChannel = {
  title: "Artigos de Elvis & cia",
  link: "https://elvisea.dev/blog",
  description: "Descrição do feed.",
  language: "pt-BR",
  self: "https://elvisea.dev/rss.xml",
};

const item: RssItem = {
  title: "Post com <tag> & símbolo",
  link: "https://elvisea.dev/blog/post",
  date: "2026-03-10",
  description: "Resumo do post.",
  categories: ["nextjs", "arquitetura"],
};

describe("buildRssFeed", () => {
  it("monta o canal com idioma e link do próprio feed", () => {
    const xml = buildRssFeed(channel, []);
    expect(xml).toStartWith('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<title>Artigos de Elvis &amp; cia</title>");
    expect(xml).toContain("<language>pt-BR</language>");
    expect(xml).toContain(
      '<atom:link href="https://elvisea.dev/rss.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("escapa o título do item e usa o link como guid permanente", () => {
    const xml = buildRssFeed(channel, [item]);
    expect(xml).toContain("<title>Post com &lt;tag&gt; &amp; símbolo</title>");
    expect(xml).toContain(
      '<guid isPermaLink="true">https://elvisea.dev/blog/post</guid>',
    );
  });

  it("data vira RFC 822 ao meio-dia UTC e as tags viram categorias", () => {
    const xml = buildRssFeed(channel, [item]);
    expect(xml).toContain("<pubDate>Tue, 10 Mar 2026 12:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>nextjs</category>");
    expect(xml).toContain("<category>arquitetura</category>");
  });

  it("item sem tags não deixa linha vazia", () => {
    const xml = buildRssFeed(channel, [{ ...item, categories: [] }]);
    expect(xml).not.toContain("\n\n");
  });
});
