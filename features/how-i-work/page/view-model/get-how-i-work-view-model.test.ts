import { describe, expect, it, mock } from "bun:test";

import { comoTrabalhoPage } from "@/content/pt-BR/pages/profissional";

import { getHowIWorkViewModel } from "./get-how-i-work-view-model";

describe("getHowIWorkViewModel", () => {
  it("renderiza o Markdown da página e monta trilha e metadata", async () => {
    const renderPage = mock(async () => "<p>texto</p>");
    const model = await getHowIWorkViewModel(renderPage);
    expect(renderPage).toHaveBeenCalledWith("como-trabalho");
    expect(model.html).toBe("<p>texto</p>");
    expect(model.header).toBe(comoTrabalhoPage.header);
    expect(model.breadcrumb).toEqual([
      { name: comoTrabalhoPage.metaTitle, path: "/como-trabalho" },
    ]);
    expect(model.metadata.alternates?.canonical).toBe("/como-trabalho");
  });
});
