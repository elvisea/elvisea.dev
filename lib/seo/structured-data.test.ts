import { describe, expect, it } from "bun:test";

import { site } from "@/content/pt-BR/site";

import {
  blogPostingNode,
  breadcrumbNode,
  jsonLdGraph,
  personNode,
  profilePageNode,
  schemaIds,
  serviceNode,
  websiteNode,
} from "./structured-data";

describe("grafo do site", () => {
  it("liga WebSite e Person pelo @id", () => {
    const graph = jsonLdGraph([websiteNode(), personNode()]);
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"]).toMatchObject([
      {
        "@type": "WebSite",
        "@id": schemaIds.website,
        url: `${site.url}/`,
        publisher: { "@id": schemaIds.person },
      },
      { "@type": "Person", "@id": schemaIds.person },
    ]);
  });

  it("identifica a pessoa pelos perfis públicos e pela formação", () => {
    const person = personNode();
    expect(person.sameAs).toEqual([
      site.links.linkedin.href,
      site.links.github.href,
      ...site.seo.otherProfiles,
    ]);
    expect(person.alumniOf).toContainEqual({
      "@type": "EducationalOrganization",
      name: "UNINTER Centro Universitário Internacional",
    });
    expect(person.knowsLanguage).toBe("pt-BR");
  });

  it("usa URLs absolutas em https no domínio do site", () => {
    const urls = JSON.stringify([websiteNode(), personNode()]).match(
      /https?:\/\/[^"]+/g,
    );
    const internal = (urls ?? []).filter((url) => url.includes(site.domain));
    expect(internal.length).toBeGreaterThan(0);
    for (const url of internal) expect(url.startsWith(site.url)).toBe(true);
  });
});

describe("nós de página", () => {
  it("ProfilePage aponta para a pessoa e o site", () => {
    expect(profilePageNode({ name: "Perfil", path: "/sobre" })).toEqual({
      "@type": "ProfilePage",
      "@id": `${site.url}/sobre#profilepage`,
      url: `${site.url}/sobre`,
      name: "Perfil",
      inLanguage: "pt-BR",
      isPartOf: { "@id": schemaIds.website },
      mainEntity: { "@id": schemaIds.person },
    });
  });

  it("trilha começa na home e numera a partir de 1", () => {
    const node = breadcrumbNode([
      { name: "Blog", path: "/blog" },
      { name: "Post", path: "/blog/post" },
    ]);
    expect(node.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: site.seo.breadcrumbHome,
        item: `${site.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${site.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Post",
        item: `${site.url}/blog/post`,
      },
    ]);
  });

  it("BlogPosting referencia autor por @id e usa updated quando existe", () => {
    const node = blogPostingNode({
      slug: "exemplo",
      title: "Título",
      description: "Descrição",
      date: "2026-09-01",
      updated: "2026-09-10",
      tags: ["nestjs", "postgresql"],
    });
    expect(node).toMatchObject({
      "@type": "BlogPosting",
      url: `${site.url}/blog/exemplo`,
      datePublished: "2026-09-01",
      dateModified: "2026-09-10",
      keywords: "nestjs, postgresql",
      author: { "@id": schemaIds.person },
      publisher: { "@id": schemaIds.person },
    });
  });

  it("BlogPosting sem tags omite keywords", () => {
    const node = blogPostingNode({
      slug: "x",
      title: "T",
      description: "D",
      date: "2026-09-01",
      tags: [],
    });
    expect(node.keywords).toBeUndefined();
    expect(node.dateModified).toBe("2026-09-01");
  });
});

describe("Service", () => {
  it("aponta o prestador pelo @id e atende o Brasil", () => {
    const node = serviceNode({
      slug: "exemplo",
      title: "Serviço de exemplo",
      shortTitle: "Exemplo",
      summary: "Resumo.",
    });
    expect(node).toMatchObject({
      "@type": "Service",
      "@id": `${site.url}/servicos/exemplo#service`,
      url: `${site.url}/servicos/exemplo`,
      name: "Serviço de exemplo",
      serviceType: "Exemplo",
      provider: { "@id": schemaIds.person },
      areaServed: { "@type": "Country", name: "Brasil" },
    });
  });
});
