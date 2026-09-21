import { describe, expect, it } from "bun:test";

import { curriculoPage } from "@/content/pt-BR/pages/profissional";

import { getResumeViewModel } from "./get-resume-view-model";

describe("getResumeViewModel", () => {
  const model = getResumeViewModel();

  it("um card por arquivo, com o rótulo de download em cada um", () => {
    expect(model.files).toHaveLength(curriculoPage.files.length);
    for (const file of model.files) {
      expect(file.href).toStartWith("/");
      expect(file.download).toBe(curriculoPage.download);
    }
  });

  it("trilha e metadata da página", () => {
    expect(model.breadcrumb).toEqual([
      { name: curriculoPage.metaTitle, path: "/curriculo" },
    ]);
    expect(model.metadata.alternates?.canonical).toBe("/curriculo");
  });
});
