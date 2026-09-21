import { describe, expect, it } from "bun:test";

import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import type { Experience, StackItem } from "@/lib/content/types";

import { toTimelineEntries, toTimelineEntry } from "./timeline";

const experience = {
  slug: "atz-aero",
  role: "Desenvolvedor Full-Stack Sênior",
  company: "ATZ AERO",
  companyUrl: "https://www.linkedin.com/company/atzaero/",
  engagement: "CLT",
  location: "Curitiba",
  mode: "remoto",
  start: "2024-01",
  end: null,
  summary: ["Primeiro parágrafo.", "Segundo parágrafo."],
  groups: [{ title: "Entregas", bullets: ["Bullet 1", "Bullet 2"] }],
  stack: ["typescript"],
} as unknown as Experience;

const stackItem = (key: string): StackItem | undefined =>
  key === "typescript"
    ? { key, label: "TypeScript", icon: "siTypescript" }
    : undefined;

const texts = {
  stack: experienciaPage.labels.stack,
  companyPage: experienciaPage.labels.companyPage,
  modes: experienciaPage.modes,
};

describe("toTimelineEntry", () => {
  it("modo completo: âncora, todos os parágrafos e os blocos de bullets", () => {
    const entry = toTimelineEntry(experience, texts, { full: true, stackItem });
    expect(entry.anchor).toBe("atz-aero");
    expect(entry.roleHref).toBeNull();
    expect(entry.paragraphs).toHaveLength(2);
    expect(entry.groups).toEqual([
      { title: "Entregas", bullets: ["Bullet 1", "Bullet 2"] },
    ]);
  });

  it("modo compacto: só a abertura, com o cargo levando à página completa", () => {
    const entry = toTimelineEntry(experience, texts, {
      full: false,
      stackItem,
    });
    expect(entry.anchor).toBeNull();
    expect(entry.roleHref).toBe("/experiencia#atz-aero");
    expect(entry.paragraphs).toEqual(["Primeiro parágrafo."]);
    expect(entry.groups).toEqual([]);
  });

  it("período, local com modalidade e experiência em andamento", () => {
    const entry = toTimelineEntry(experience, texts, { full: true, stackItem });
    expect(entry.current).toBe(true);
    expect(entry.place).toBe(`Curitiba · ${experienciaPage.modes.remoto}`);
    expect(entry.period).toContain("2024");
  });

  it("empresa com link ganha nome acessível; badges vêm da stack", () => {
    const entry = toTimelineEntry(experience, texts, { full: true, stackItem });
    expect(entry.company).toEqual({
      name: "ATZ AERO",
      href: "https://www.linkedin.com/company/atzaero/",
      ariaLabel: `ATZ AERO — ${experienciaPage.labels.companyPage}`,
    });
    expect(entry.stack).toEqual({
      label: `${experienciaPage.labels.stack} na ATZ AERO`,
      badges: [
        { key: "typescript", label: "TypeScript", icon: "siTypescript" },
      ],
    });
  });

  it("sem local nem modalidade, não mostra a linha", () => {
    const entry = toTimelineEntry(
      {
        ...experience,
        location: undefined,
        mode: undefined,
      } as unknown as Experience,
      texts,
      { full: true, stackItem },
    );
    expect(entry.place).toBeNull();
    expect(entry.company.ariaLabel).toBeDefined();
  });
});

describe("toTimelineEntries", () => {
  it("usa os textos do conteúdo e aplica o modo em todas as entradas", () => {
    const entries = toTimelineEntries([experience, experience], {
      full: false,
      stackItem,
    });
    expect(entries).toHaveLength(2);
    for (const entry of entries) {
      expect(entry.roleHref).toBe("/experiencia#atz-aero");
      expect(entry.paragraphs).toEqual(["Primeiro parágrafo."]);
      expect(entry.groups).toEqual([]);
      expect(entry.stack.label).toBe(
        `${experienciaPage.labels.stack} na ATZ AERO`,
      );
    }
  });
});
