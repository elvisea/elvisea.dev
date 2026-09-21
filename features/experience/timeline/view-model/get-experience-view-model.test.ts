import { describe, expect, it } from "bun:test";

import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import { createAboutRepository } from "@/features/about/repository/about-repository";
import { createExperienceRepository } from "@/features/experience/repository/experience-repository";
import type { Experience } from "@/lib/content/types";

import {
  getExperienceViewModel,
  getTimelineEntries,
} from "./get-experience-view-model";

const experience = (slug: string, highlight?: boolean): Experience =>
  ({
    slug,
    role: "Dev",
    company: slug,
    start: "2024-01",
    end: null,
    mode: "remoto",
    location: "Curitiba",
    summary: ["Um.", "Dois."],
    groups: [{ title: "Entregas", bullets: ["b"] }],
    stack: ["typescript"],
    highlight,
  }) as unknown as Experience;

const repositories = {
  experiences: createExperienceRepository([
    experience("atual", true),
    experience("anterior"),
  ]),
  about: createAboutRepository({
    profile: {
      resumo: "",
      atuacao: [],
      engenhariaComIa: "",
      projetosProprios: "",
    },
    stack: [
      {
        title: "Linguagens",
        items: [{ key: "typescript", label: "TypeScript" }],
      },
    ],
    education: [],
    certificates: [],
  }),
};

describe("getExperienceViewModel", () => {
  const model = getExperienceViewModel(repositories);

  it("lista todas as experiências no modo completo", () => {
    expect(model.entries.map((entry) => entry.slug)).toEqual([
      "atual",
      "anterior",
    ]);
    expect(model.entries[0]?.anchor).toBe("atual");
    expect(model.entries[0]?.paragraphs).toHaveLength(2);
  });

  it("badges da stack já resolvidas pelo repository de sobre", () => {
    expect(model.entries[0]?.stack.badges).toEqual([
      { key: "typescript", label: "TypeScript", icon: undefined },
    ]);
  });

  it("trilha e metadata da página", () => {
    expect(model.breadcrumb).toEqual([
      { name: experienciaPage.metaTitle, path: "/experiencia" },
    ]);
    expect(model.metadata.alternates?.canonical).toBe("/experiencia");
  });
});

describe("getTimelineEntries", () => {
  it("versão compacta traz só os destaques, com link para a página completa", () => {
    const entries = getTimelineEntries(false, repositories);
    expect(entries.map((entry) => entry.slug)).toEqual(["atual"]);
    expect(entries[0]?.roleHref).toBe("/experiencia#atual");
    expect(entries[0]?.paragraphs).toEqual(["Um."]);
    expect(entries[0]?.groups).toEqual([]);
  });
});
