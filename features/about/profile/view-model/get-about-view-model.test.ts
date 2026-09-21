import { describe, expect, it } from "bun:test";

import { sobrePage } from "@/content/pt-BR/pages/profissional";
import {
  type AboutSource,
  createAboutRepository,
} from "@/features/about/repository/about-repository";
import type { Certificate } from "@/lib/content/types";

import {
  getAboutViewModel,
  getProfileModel,
  getStackGroups,
} from "./get-about-view-model";

const source: AboutSource = {
  profile: {
    resumo: "Resumo do perfil.",
    atuacao: ["Atuação 1", "Atuação 2"],
    engenhariaComIa: "Texto de engenharia com IA.",
    projetosProprios: "Projetos próprios.",
  },
  stack: [
    {
      title: "Linguagens",
      items: [{ key: "typescript", label: "TypeScript", icon: "siTypescript" }],
    },
  ],
  education: [
    {
      institution: "UTFPR",
      degree: "Bacharelado",
      field: "Sistemas",
      startYear: 2019,
      endYear: 2023,
    },
  ],
  certificates: [
    {
      slug: "curso",
      title: "Curso",
      issuer: "Escola",
      issued: "2025-06",
      visible: true,
      url: "https://exemplo.dev/cert",
    } as Certificate,
  ],
};

const repository = createAboutRepository(source);

describe("getAboutViewModel", () => {
  const model = getAboutViewModel(repository);

  it("perfil e atuação vêm do repository", () => {
    expect(model.profile).toEqual({
      summary: "Resumo do perfil.",
      atuacao: { title: sobrePage.atuacao, items: ["Atuação 1", "Atuação 2"] },
    });
  });

  it("engenharia com IA leva a como trabalho, e há link do currículo", () => {
    expect(model.aiEngineering).toEqual({
      title: sobrePage.engenhariaComIa.title,
      text: "Texto de engenharia com IA.",
      link: { href: "/como-trabalho", label: sobrePage.engenhariaComIa.link },
    });
    expect(model.resumeLink).toEqual({
      href: "/curriculo",
      label: sobrePage.curriculo,
    });
  });

  it("stack, formação e certificados já formatados", () => {
    expect(model.stack.groups).toEqual([
      {
        title: "Linguagens",
        items: [
          { key: "typescript", label: "TypeScript", icon: "siTypescript" },
        ],
      },
    ]);
    expect(model.education.items[0]?.years).toBe("2019 – 2023");
    expect(model.certificates.items[0]?.date).toEqual({
      label: "jun/2025",
      iso: "2025-06",
    });
  });

  it("trilha, JSON-LD de perfil e metadata", () => {
    expect(model.breadcrumb).toEqual([
      { name: sobrePage.metaTitle, path: "/sobre" },
    ]);
    expect(model.jsonLd[0]).toMatchObject({ "@type": "ProfilePage" });
    expect(model.metadata.alternates?.canonical).toBe("/sobre");
  });
});

describe("modelos compartilhados com a home", () => {
  it("getProfileModel e getStackGroups usam o mesmo repository", () => {
    expect(getProfileModel(repository).summary).toBe("Resumo do perfil.");
    expect(getStackGroups(repository)).toHaveLength(1);
  });
});
