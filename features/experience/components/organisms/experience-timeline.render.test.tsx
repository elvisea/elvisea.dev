import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import type { TimelineEntry } from "@/features/experience/domain/timeline";

import { ExperienceTimeline } from "./experience-timeline";

const entry: TimelineEntry = {
  slug: "atz-aero",
  anchor: "atz-aero",
  current: true,
  period: "jan/2024 – atual",
  role: "Desenvolvedor Full-Stack Sênior",
  roleHref: null,
  company: {
    name: "ATZ AERO",
    href: "https://www.linkedin.com/company/atzaero/",
    ariaLabel: "ATZ AERO — Página da empresa no LinkedIn",
  },
  engagement: "CLT",
  place: "Curitiba · Remoto",
  paragraphs: ["Primeiro parágrafo.", "Segundo parágrafo."],
  groups: [{ title: "Entregas", bullets: ["Bullet 1"] }],
  stack: {
    label: "Tecnologias usadas na ATZ AERO",
    badges: [{ key: "typescript", label: "TypeScript" }],
  },
};

describe("ExperienceTimeline", () => {
  it("modo completo: âncora no item, cargo sem link e os bullets", () => {
    const { container } = render(<ExperienceTimeline entries={[entry]} />);
    expect(container.querySelector("#atz-aero")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: entry.role }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: entry.role })).toBeNull();
    expect(screen.getByText("Bullet 1")).toBeInTheDocument();
    expect(screen.getByText("Segundo parágrafo.")).toBeInTheDocument();
  });

  it("empresa com link tem nome acessível e abre em nova aba", () => {
    render(<ExperienceTimeline entries={[entry]} />);
    const link = screen.getByRole("link", { name: entry.company.ariaLabel });
    expect(link).toHaveAttribute("href", entry.company.href);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("tecnologias saem numa lista com nome acessível", () => {
    render(<ExperienceTimeline entries={[entry]} />);
    expect(
      screen.getByRole("list", { name: entry.stack.label }),
    ).toBeInTheDocument();
  });

  it("modo compacto: cargo vira link para a página completa, sem âncora", () => {
    const compact: TimelineEntry = {
      ...entry,
      anchor: null,
      roleHref: "/experiencia#atz-aero",
      paragraphs: ["Primeiro parágrafo."],
      groups: [],
    };
    const { container } = render(<ExperienceTimeline entries={[compact]} />);
    expect(screen.getByRole("link", { name: entry.role })).toHaveAttribute(
      "href",
      "/experiencia#atz-aero",
    );
    expect(container.querySelector("#atz-aero")).toBeNull();
    expect(screen.queryByText("Bullet 1")).toBeNull();
  });
});
