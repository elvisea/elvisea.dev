/**
 * Sumário (table of contents) a partir do Markdown.
 *
 * Os ids seguem o mesmo algoritmo do `rehype-slug` (github-slugger), então os
 * links `#id` batem com os títulos renderizados.
 */
import GithubSlugger from "github-slugger";
import type { Heading, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export function extractToc(markdown: string): TocItem[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as Root;
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = toString(node);
    // O slugger precisa ver todos os títulos, na ordem, para numerar repetidos.
    const id = slugger.slug(text);
    if (node.depth === 2 || node.depth === 3) {
      items.push({ id, text, depth: node.depth });
    }
  });

  return items;
}
