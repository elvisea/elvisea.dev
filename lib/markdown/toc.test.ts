import { describe, expect, it } from "bun:test";

import { renderMarkdown } from "./render";
import { extractToc } from "./toc";

describe("extractToc", () => {
  const md =
    "# Título\n\n## Introdução\n\ntexto\n\n### Detalhe técnico\n\n## Introdução\n\n#### Fora do sumário";

  it("lista h2 e h3 com ids iguais aos do HTML renderizado", async () => {
    const toc = extractToc(md);
    expect(toc).toEqual([
      { id: "introdução", text: "Introdução", depth: 2 },
      { id: "detalhe-técnico", text: "Detalhe técnico", depth: 3 },
      { id: "introdução-1", text: "Introdução", depth: 2 },
    ]);
    const html = await renderMarkdown(md);
    for (const item of toc) expect(html).toContain(`id="${item.id}"`);
  });
});
