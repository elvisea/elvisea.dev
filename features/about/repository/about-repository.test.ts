import { describe, expect, it } from "bun:test";

import type { Certificate, StackGroup } from "@/lib/content/types";

import {
  aboutRepository,
  type AboutSource,
  createAboutRepository,
} from "./about-repository";

const stack: StackGroup[] = [
  {
    title: "Linguagens",
    items: [
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
      { key: "elixir", label: "Elixir" },
    ],
  },
];

const certificate = (
  slug: string,
  issued: string | undefined,
  visible = true,
): Certificate =>
  ({
    slug,
    title: `Curso ${slug}`,
    issuer: "Escola",
    issued,
    visible,
  }) as Certificate;

const source: AboutSource = {
  profile: {
    resumo: "Resumo",
    atuacao: ["a"],
    engenhariaComIa: "Texto de engenharia com IA.",
    projetosProprios: "Texto de projetos próprios.",
  },
  stack,
  education: [],
  certificates: [
    certificate("antigo", "2023-01"),
    certificate("oculto", "2026-01", false),
    certificate("sem-data", undefined),
    certificate("novo", "2025-06"),
  ],
};

const repository = createAboutRepository(source);

describe("createAboutRepository", () => {
  it("busca item da stack pelo key", () => {
    expect(repository.stackItem("typescript")?.label).toBe("TypeScript");
    expect(repository.stackItem("nao-existe")).toBeUndefined();
  });

  it("certificados: só visíveis, com data primeiro e mais recente antes", () => {
    expect(repository.certificates().map((c) => c.slug)).toEqual([
      "novo",
      "antigo",
      "sem-data",
    ]);
  });

  it("entrega perfil, stack e formação como vieram da fonte", () => {
    expect(repository.profile()).toBe(source.profile);
    expect(repository.stackGroups()).toBe(stack);
    expect(repository.education()).toBe(source.education);
  });
});

describe("aboutRepository", () => {
  it("usa o conteúdo real do site", () => {
    expect(aboutRepository.stackGroups().length).toBeGreaterThan(0);
    expect(aboutRepository.certificates().length).toBeGreaterThan(0);
    expect(aboutRepository.profile().atuacao.length).toBeGreaterThan(0);
  });
});
