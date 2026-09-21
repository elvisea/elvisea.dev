/**
 * Páginas de texto em Markdown (`content/pt-BR/*.md`), renderizadas em build
 * com o mesmo pipeline do blog. A leitura do arquivo é injetável para os
 * testes não dependerem do filesystem.
 */
import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderMarkdown } from "@/lib/markdown/render";

export type ReadText = (file: string) => Promise<string>;

const readFromDisk: ReadText = (file) => readFile(file, "utf8");

export async function renderContentPage(
  name: string,
  readText: ReadText = readFromDisk,
): Promise<string> {
  const file = path.join(process.cwd(), "content", "pt-BR", `${name}.md`);
  return renderMarkdown(await readText(file));
}
