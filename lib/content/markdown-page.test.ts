import { describe, expect, it, mock } from "bun:test";

import path from "node:path";

import { renderContentPage } from "./markdown-page";

describe("renderContentPage", () => {
  it("lê content/pt-BR/<nome>.md e devolve o HTML", async () => {
    const readText = mock(async () => "## Seção\n\nTexto com **ênfase**.");
    const html = await renderContentPage("projetos/casos/x", readText);
    expect(readText).toHaveBeenCalledWith(
      path.join(process.cwd(), "content", "pt-BR", "projetos", "casos", "x.md"),
    );
    expect(html).toContain(`<h2 id="seção">`);
    expect(html).toContain("<strong>ênfase</strong>");
  });
});
