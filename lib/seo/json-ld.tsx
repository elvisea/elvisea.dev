/**
 * Dados estruturados (schema.org) em JSON-LD.
 *
 * `JsonLd` escapa `<` para impedir que texto do conteúdo feche a tag
 * `<script>` (recomendação do Next para JSON-LD).
 */
import { site } from "@/content/pt-BR/site";
import { stack } from "@/content/pt-BR/stack";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.person.fullName,
    alternateName: site.person.name,
    jobTitle: site.person.role,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    sameAs: Object.values(site.links).map((link) => link.href),
    knowsAbout: stack.flatMap((group) => group.items.map((item) => item.label)),
  };
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: readonly string[];
}) {
  const url = `${site.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "pt-BR",
    keywords: post.tags.join(", ") || undefined,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: {
      "@type": "Person",
      name: site.person.fullName,
      url: site.url,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
