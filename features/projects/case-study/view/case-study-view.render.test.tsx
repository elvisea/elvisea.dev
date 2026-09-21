import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import type { CaseStudyViewModel } from "@/features/projects/case-study/view-model/get-case-study-view-model";

import { CaseStudyView } from "./case-study-view";

const model: CaseStudyViewModel = {
  back: { href: "/projetos", label: "Voltar para projetos" },
  header: {
    eyebrow: "Projetos",
    title: "Estudo de caso",
    description: "Resumo.",
  },
  html: "<h2>Problema</h2><p>Texto do caso.</p>",
  breadcrumb: [
    { name: "Projetos", path: "/projetos" },
    { name: "Estudo de caso", path: "/projetos/caso" },
  ],
  metadata: {
    title: "Estudo de caso",
    description: "Resumo.",
    path: "/projetos/caso",
  },
};

describe("CaseStudyView", () => {
  it("link de volta, h1 do projeto e o texto do Markdown", () => {
    render(<CaseStudyView model={model} />);
    expect(
      screen.getByRole("link", { name: "Voltar para projetos" }),
    ).toHaveAttribute("href", "/projetos");
    expect(
      screen.getByRole("heading", { level: 1, name: "Estudo de caso" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Problema" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Texto do caso.")).toBeInTheDocument();
  });
});
