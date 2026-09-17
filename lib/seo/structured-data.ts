/**
 * Dados estruturados (schema.org) como funções puras.
 *
 * `WebSite` e `Person` têm `@id` fixo e vão no layout, em todas as páginas.
 * Os nós de cada página (`ProfilePage`, `BreadcrumbList`, `BlogPosting`,
 * `Service`)
 * apontam para a pessoa e o site pelo `@id`, sem repetir os dados.
 */
import { formacao } from "@/content/pt-BR/formacao";
import { site } from "@/content/pt-BR/site";
import { stack } from "@/content/pt-BR/stack";

export type JsonLdNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  /** Caminho começando com `/`. */
  path: string;
}

export const schemaIds = {
  website: `${site.url}/#website`,
  person: `${site.url}/#person`,
} as const;

const websiteRef = { "@id": schemaIds.website };
const personRef = { "@id": schemaIds.person };

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}

export function jsonLdGraph(nodes: readonly JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": schemaIds.website,
    url: absoluteUrl("/"),
    name: site.domain,
    description: site.description,
    inLanguage: site.language,
    publisher: personRef,
  };
}

export function personNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": schemaIds.person,
    name: site.person.fullName,
    alternateName: site.person.name,
    jobTitle: site.person.role,
    url: absoluteUrl("/"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    sameAs: [
      ...Object.values(site.links).map((link) => link.href),
      ...site.seo.otherProfiles,
    ],
    alumniOf: formacao.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    knowsLanguage: site.language,
    knowsAbout: stack.flatMap((group) => group.items.map((item) => item.label)),
  };
}

export function profilePageNode(page: { name: string; path: string }) {
  const url = absoluteUrl(page.path);
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: page.name,
    inLanguage: site.language,
    isPartOf: websiteRef,
    mainEntity: personRef,
  };
}

/** Trilha a partir da home, que entra sempre como primeiro item. */
export function breadcrumbNode(items: readonly BreadcrumbItem[]): JsonLdNode {
  const trail = [{ name: site.seo.breadcrumbHome, path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingNode(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: readonly string[];
}): JsonLdNode {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: site.language,
    keywords: post.tags.join(", ") || undefined,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    isPartOf: websiteRef,
    author: personRef,
    publisher: personRef,
  };
}

export function serviceNode(service: {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
}): JsonLdNode {
  const url = absoluteUrl(`/servicos/${service.slug}`);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.shortTitle,
    description: service.summary,
    url,
    provider: personRef,
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}
