import { describe, expect, it, mock } from "bun:test";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import type { ProjectsRepository } from "@/features/projects/repository/projects-repository";
import type { Project } from "@/features/projects/repository/types";

import {
  getCaseStudyMetadata,
  getCaseStudySlugs,
  getCaseStudyViewModel,
} from "./get-case-study-view-model";

const caso: Project = {
  slug: "caso",
  source: "manual",
  title: "Estudo de caso",
  summary: "Projeto privado.",
  language: null,
  tags: [],
  repoUrl: null,
  liveUrl: null,
  stars: 0,
  fork: false,
  updatedAt: null,
  caseStudy: true,
};

const repository = {
  caseStudies: () => [caso],
  findCaseStudy: (slug: string) => (slug === "caso" ? caso : undefined),
} as unknown as ProjectsRepository;

describe("estudo de caso", () => {
  it("slugs vêm só dos estudos de caso", () => {
    expect(getCaseStudySlugs(repository)).toEqual(["caso"]);
  });

  it("metadata com o resumo e o caminho", () => {
    expect(getCaseStudyMetadata("caso", repository)).toEqual({
      title: "Estudo de caso",
      description: "Projeto privado.",
      path: "/projetos/caso",
    });
    expect(getCaseStudyMetadata("outro", repository)).toBeNull();
  });

  it("renderiza o Markdown do caso e monta a trilha", async () => {
    const renderPage = mock(async () => "<p>texto</p>");
    const model = await getCaseStudyViewModel("caso", {
      repository,
      renderPage,
    });
    expect(renderPage).toHaveBeenCalledWith("projetos/casos/caso");
    expect(model).toMatchObject({
      back: { href: "/projetos", label: projetosPage.caseStudy.back },
      header: {
        eyebrow: projetosPage.header.eyebrow,
        title: "Estudo de caso",
        description: "Projeto privado.",
      },
      html: "<p>texto</p>",
      breadcrumb: [
        { name: projetosPage.metaTitle, path: "/projetos" },
        { name: "Estudo de caso", path: "/projetos/caso" },
      ],
    });
  });

  it("slug que não é estudo de caso: null, sem ler arquivo", async () => {
    const renderPage = mock(async () => "");
    expect(
      await getCaseStudyViewModel("outro", { repository, renderPage }),
    ).toBeNull();
    expect(renderPage).not.toHaveBeenCalled();
  });
});
