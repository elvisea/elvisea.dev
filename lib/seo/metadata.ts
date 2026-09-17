/**
 * Metadata por página com os padrões do site.
 *
 * Motivo: no Next, `openGraph`, `twitter` e `alternates` de uma página
 * **substituem** os do layout (não mesclam). Sem este helper, cada página teria de repetir
 * `siteName`, `locale`, `type` e descrição, ou os perderia.
 *
 * A imagem OG vem dos arquivos `opengraph-image.tsx` (convenção do Next), que
 * têm prioridade sobre o objeto de metadata.
 */
import type { Metadata } from "next";

import { site } from "@/content/pt-BR/site";

export const siteTitle = `${site.person.name} · ${site.person.role}`;

/** Feed RSS anunciado no `<head>` de todas as páginas. */
export const rssAlternate = {
  "application/rss+xml": [
    { url: "/rss.xml", title: `Artigos · ${site.person.name}` },
  ],
};

interface PageMetadataInput {
  /** Título da página; o layout aplica o template `%s · Nome`. Ausente = título padrão. */
  title?: string;
  description?: string;
  /** Caminho canônico, começando com `/`. */
  path: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    tags?: string[];
  };
}

export function pageMetadata({
  title,
  description = site.description,
  path,
  article,
}: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} · ${site.person.name}` : siteTitle;

  return {
    ...(title ? { title } : {}),
    description,
    // `alternates` da página substitui o do layout: repetir o RSS aqui.
    alternates: { canonical: path, types: rssAlternate },
    openGraph: {
      siteName: site.domain,
      locale: site.locale,
      url: path,
      title: fullTitle,
      description,
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: [site.person.fullName],
            tags: article.tags,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
