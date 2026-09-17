/**
 * Textos do blog: rota `/blog`, prévia na home, `PostCard` e `PostMeta`.
 * O conteúdo dos posts fica em `content/pt-BR/blog/posts/*.md`.
 */
export const blogPage = {
  metaTitle: "Blog",
  metaDescription:
    "Artigos de Elvis Amancio sobre desenvolvimento de software, integração de sistemas e operação de produtos digitais.",
  header: {
    eyebrow: "Blog",
    title: "Artigos",
    description:
      "Textos sobre desenvolvimento de software, integração de sistemas, modernização de legado e operação de produtos.",
  },
  preview: {
    eyebrow: "Blog",
    title: "Artigos recentes",
    viewAll: "Ver todos os artigos",
  },
  emptyState: {
    title: "Nenhum artigo publicado ainda",
    description: "Os primeiros textos estão em revisão.",
  },
  card: {
    readMore: "Ler artigo",
  },
  meta: {
    by: "Por",
    readingTime: (min: number) => `${min} min de leitura`,
    updated: "atualizado em",
  },
  post: {
    back: "Todos os artigos",
    toc: "Neste artigo",
    shareLinkedIn: "Compartilhar no LinkedIn",
  },
  rss: {
    title: "Artigos de Elvis Amancio",
    link: "RSS",
  },
} as const;
