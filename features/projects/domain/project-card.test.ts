import { describe, expect, it } from "bun:test";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import type { Project } from "@/features/projects/repository/types";

import { toProjectCardModel } from "./project-card";

const base: Project = {
  slug: "site",
  source: "github",
  title: "site",
  summary: "Site pessoal.",
  language: "TypeScript",
  tags: [],
  repoUrl: "https://github.com/elvisea/site",
  liveUrl: null,
  stars: 0,
  fork: false,
  updatedAt: "2026-03-10T12:00:00Z",
  caseStudy: false,
};

const card = (project: Partial<Project>) =>
  toProjectCardModel({ ...base, ...project }, projetosPage.card);

describe("toProjectCardModel", () => {
  it("projeto do GitHub com resumo: link do código e data de atualização", () => {
    const model = card({});
    expect(model.summary).toBe("Site pessoal.");
    expect(model.hasSummary).toBe(true);
    expect(model.repo).toEqual({
      href: "https://github.com/elvisea/site",
      label: projetosPage.card.code,
      ariaLabel: `${projetosPage.card.code}: site`,
    });
    expect(model.site).toBeNull();
    expect(model.updated).toEqual({
      label: projetosPage.card.updated,
      value: "mar/2026",
    });
    expect(model.fork).toBeNull();
    expect(model.stars).toBeNull();
  });

  it("sem descrição, fork, com estrelas e site", () => {
    const model = card({
      summary: null,
      fork: true,
      stars: 2,
      liveUrl: "https://exemplo.dev",
    });
    expect(model.summary).toBe(projetosPage.card.noDescription);
    expect(model.hasSummary).toBe(false);
    expect(model.fork).toBe(projetosPage.card.fork);
    expect(model.stars).toEqual({
      count: 2,
      label: projetosPage.card.stars(2),
    });
    expect(model.site?.href).toBe("https://exemplo.dev");
  });

  it("estudo de caso privado: página própria, sem código nem data", () => {
    const model = card({
      source: "manual",
      repoUrl: null,
      updatedAt: null,
      caseStudy: true,
    });
    expect(model.caseStudy).toEqual({
      href: "/projetos/site",
      label: projetosPage.card.caseStudy,
    });
    expect(model.repo).toBeNull();
    expect(model.updated).toBeNull();
  });
});
