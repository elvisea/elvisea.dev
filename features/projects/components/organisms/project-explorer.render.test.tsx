import { describe, expect, it } from "bun:test";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { buildLanguageOptions } from "@/features/projects/catalog/view-model/project-filter";
import { toProjectCardModel } from "@/features/projects/domain/project-card";
import type { Project } from "@/features/projects/repository/types";

import { ProjectExplorer } from "./project-explorer";

const project = (slug: string, language: string): Project => ({
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

const cards = [
  project("api", "TypeScript"),
  project("bot", "Elixir"),
  project("web", "TypeScript"),
].map((p) => toProjectCardModel(p, projetosPage.card));

const filter = {
  label: projetosPage.filter.label,
  options: buildLanguageOptions(
    3,
    [
      { language: "TypeScript", count: 2 },
      { language: "Elixir", count: 1 },
    ],
    projetosPage.filter,
  ),
};

const titles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("ProjectExplorer", () => {
  it("começa com todos os projetos e o contador total", () => {
    render(<ProjectExplorer cards={cards} filter={filter} />);
    expect(titles()).toEqual(["api", "bot", "web"]);
    expect(screen.getByText(projetosPage.filter.count(3))).toBeInTheDocument();
  });

  it("filtra por linguagem e atualiza o contador", async () => {
    render(<ProjectExplorer cards={cards} filter={filter} />);
    const group = screen.getByRole("group", { name: filter.label });
    await userEvent.click(
      within(group).getByRole("button", { name: /Elixir/ }),
    );
    expect(titles()).toEqual(["bot"]);
    expect(screen.getByText(projetosPage.filter.count(1))).toBeInTheDocument();
    expect(
      within(group).getByRole("button", { name: /Elixir/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("clicar de novo na opção ativa não desmarca o filtro", async () => {
    render(<ProjectExplorer cards={cards} filter={filter} />);
    const group = screen.getByRole("group", { name: filter.label });
    const typescript = within(group).getByRole("button", {
      name: /TypeScript/,
    });
    await userEvent.click(typescript);
    await userEvent.click(typescript);
    expect(titles()).toEqual(["api", "web"]);
  });
});
