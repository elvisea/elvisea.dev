# Blog

Posts em Markdown versionados no repositório, gerados em build (SSG). Não há
banco, painel nem CMS.

## Escrever um post

1. Crie `content/pt-BR/blog/posts/<slug>.md`. O nome do arquivo é a URL
   (`/blog/<slug>`): minúsculas, números e hífens. Renomear depois quebra links.
2. Frontmatter (validado por `lib/blog/schema.ts`, campos extras falham o build):

   ```yaml
   ---
   title: "Título com até 90 caracteres"
   description: "Resumo de 50 a 160 caracteres, usado na busca e no card do link."
   date: "2026-09-16"
   updated: "2026-10-01" # opcional
   tags: ["Legado", "Integração"] # até 4, opcional
   draft: true # fica fora da lista, do RSS e do sitemap, e responde 404
   coverImage: "/blog/capa.png" # opcional; sem capa usa a imagem OG gerada
   ---
   ```

3. Escreva em Markdown (GFM). HTML inline é descartado.
4. O repositório é público: um post em `draft` já fica visível no GitHub.
   Rascunhos ainda não revisados ficam fora do repositório até estarem prontos.

Regras de conteúdo do `AGENTS.md` valem aqui: sem frases de efeito, sem números
inventados, cenas só se aconteceram.

## O que cada post ganha

- Página em `/blog/<slug>` com tempo de leitura e sumário (a partir de 3 seções `##`).
- Imagem OG 1200×630 em `/blog/<slug>/opengraph-image`.
- Entrada no `/rss.xml`, no `/sitemap.xml` e JSON-LD `BlogPosting`.

## Divulgar no LinkedIn

1. Publique o post (merge na `main` e deploy).
2. `bun run teaser <slug>` imprime título, descrição e o link com UTM.
3. Escreva a prévia no LinkedIn (texto próprio, sem link no corpo).
4. Coloque o link no primeiro comentário.
5. Confira o card em <https://www.linkedin.com/post-inspector/>.

## Arquitetura

| Caminho                  | Papel                                                    |
| ------------------------ | -------------------------------------------------------- |
| `lib/blog/schema.ts`     | Schema do frontmatter e tipos                            |
| `lib/blog/source.ts`     | Leitura dos `.md` com gray-matter (única parte com `fs`) |
| `lib/blog/index.ts`      | Fachada com `React.cache`; filtra drafts                 |
| `lib/markdown/render.ts` | Pipeline remark/rehype (também usado em páginas `.md`)   |
| `lib/markdown/toc.ts`    | Sumário com os mesmos ids do `rehype-slug`               |
| `app/blog/**`            | Lista, post e imagem OG                                  |
| `app/rss.xml/route.ts`   | Feed RSS                                                 |
