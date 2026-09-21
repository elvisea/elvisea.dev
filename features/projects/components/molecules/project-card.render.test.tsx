import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { toProjectCardModel } from "@/features/projects/domain/project-card";
import type { Project } from "@/features/projects/repository/types";

import { ProjectCard } from "./project-card";

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

function renderCard(project: Partial<Project> = {}) {
  return render(
    <ProjectCard
      project={toProjectCardModel({ ...base, ...project }, projetosPage.card)}
    />,
  );
}

describe("ProjectCard", () => {
  it("nome como h3, resumo, linguagem e link do código", () => {
    renderCard();
    expect(
      screen.getByRole("heading", { level: 3, name: "site" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Site pessoal.")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    const code = screen.getByRole("link", {
      name: `${projetosPage.card.code}: site`,
    });
    expect(code).toHaveAttribute("href", "https://github.com/elvisea/site");
    expect(code).toHaveAttribute("target", "_blank");
    expect(screen.queryByText(projetosPage.card.fork)).toBeNull();
  });

  it("fork e sem descrição: selo de fork e aviso em itálico", () => {
    renderCard({ fork: true, summary: null });
    expect(screen.getByText(projetosPage.card.fork)).toBeInTheDocument();
    expect(screen.getByText(projetosPage.card.noDescription)).toHaveClass(
      "italic",
    );
  });

  it("com site e estrelas: link do site e contagem acessível", () => {
    renderCard({ liveUrl: "https://exemplo.dev", stars: 3 });
    expect(
      screen.getByRole("link", { name: `${projetosPage.card.site}: site` }),
    ).toHaveAttribute("href", "https://exemplo.dev");
    expect(screen.getByText(projetosPage.card.stars(3))).toHaveClass("sr-only");
  });

  it("estudo de caso: link interno para a página do projeto", () => {
    renderCard({ caseStudy: true, repoUrl: null, source: "manual" });
    expect(
      screen.getByRole("link", { name: projetosPage.card.caseStudy }),
    ).toHaveAttribute("href", "/projetos/site");
  });
});
