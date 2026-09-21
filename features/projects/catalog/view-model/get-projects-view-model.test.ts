import { describe, expect, it } from "bun:test";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import type { ProjectsRepository } from "@/features/projects/repository/projects-repository";
import type { Project } from "@/features/projects/repository/types";

import { getProjectsViewModel } from "./get-projects-view-model";
import { ALL_LANGUAGES } from "./project-filter";

const project = (slug: string, language: string | null): Project => ({
  slug,
  source: "github",
  title: slug,
  summary: `Resumo de ${slug}`,
  language,
  tags: [],
  repoUrl: `https://github.com/elvisea/${slug}`,
  liveUrl: null,
  stars: 0,
  fork: false,
  updatedAt: null,
  caseStudy: false,
});

const projects = [project("a", "TypeScript"), project("b", "Elixir")];
const repository = {
  list: () => projects,
  languages: () => [
    { language: "TypeScript", count: 1 },
    { language: "Elixir", count: 1 },
  ],
} as unknown as ProjectsRepository;

describe("getProjectsViewModel", () => {
  const model = getProjectsViewModel(repository);

  it("um card por projeto, na ordem do repository", () => {
    expect(model.cards.map((card) => card.slug)).toEqual(["a", "b"]);
  });

  it("opções do filtro: Todas com o total e as linguagens", () => {
    expect(model.filter.label).toBe(projetosPage.filter.label);
    expect(model.filter.options.map((o) => [o.value, o.count])).toEqual([
      [ALL_LANGUAGES, 2],
      ["TypeScript", 1],
      ["Elixir", 1],
    ]);
  });

  it("trilha e metadata da página", () => {
    expect(model.breadcrumb).toEqual([
      { name: projetosPage.metaTitle, path: "/projetos" },
    ]);
    expect(model.metadata).toEqual({
      title: projetosPage.metaTitle,
      description: projetosPage.metaDescription,
      path: "/projetos",
    });
  });
});
