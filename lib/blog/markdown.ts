/**
 * Pipeline `unified` que transforma markdown bruto em HTML estático.
 *
 * Plugins, em ordem:
 *
 * 1. `remark-parse` — markdown → MDAST.
 * 2. `remark-gfm` — habilita GFM (tabelas, task lists, autolinks, ~~strike~~).
 * 3. `remark-rehype` — MDAST → HAST. `allowDangerousHtml: false` bloqueia
 *    HTML inline nos posts (defesa contra XSS no conteúdo).
 * 4. `rehype-slug` — adiciona `id` aos headings.
 * 5. `rehype-autolink-headings` — envolve cada heading em `<a>` para
 *    permitir deep-link via âncora (`#meu-titulo`).
 * 6. `rehype-highlight` — syntax highlighting via `highlight.js`. Tema
 *    importado em `app/globals.css` (`highlight.js/styles/github-dark.css`).
 * 7. `rehype-stringify` — HAST → HTML.
 *
 * O HTML resultante é injetado via `dangerouslySetInnerHTML` em
 * `<PostBody>` — seguro porque o passo 3 não permite HTML inline.
 *
 * Trocou-se `rehype-pretty-code` (Shiki) por `rehype-highlight` para
 * eliminar dynamic imports incompatíveis com o Turbopack de `next dev`.
 *
 * @module lib/blog/markdown
 */
import "server-only";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap" })
  .use(rehypeHighlight, { detect: true })
  .use(rehypeStringify);

/**
 * Renderiza markdown bruto (sem frontmatter) em HTML estático.
 * Sempre rode **no servidor** (RSC, route handler, build) — o bundle
 * do client não inclui esta pipeline.
 */
export async function renderMarkdown(raw: string): Promise<string> {
  const file = await processor.process(raw);
  return String(file);
}
