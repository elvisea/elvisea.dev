/**
 * Páginas de texto em Markdown (`content/pt-BR/*.md`), renderizadas em build
 * com o mesmo pipeline do blog.
 */
import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderMarkdown } from "@/lib/blog/markdown";

export async function renderContentPage(name: string): Promise<string> {
  const file = path.join(process.cwd(), "content", "pt-BR", `${name}.md`);
  return renderMarkdown(await readFile(file, "utf8"));
}
