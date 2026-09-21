import { describe, expect, it } from "bun:test";

import type { Profile } from "@/features/about/repository/about-repository";
import type { StackGroup } from "@/lib/content/types";

import { toProfileModel, toStackGroups } from "./profile";

const profile: Profile = {
  resumo: "Resumo do perfil.",
  atuacao: ["Atuação 1", "Atuação 2"],
  engenhariaComIa: "IA.",
  projetosProprios: "Projetos.",
};

describe("toProfileModel", () => {
  it("usa o resumo e a lista de atuação, com o título recebido", () => {
    expect(toProfileModel(profile, "Atuação")).toEqual({
      summary: "Resumo do perfil.",
      atuacao: { title: "Atuação", items: ["Atuação 1", "Atuação 2"] },
    });
  });
});

describe("toStackGroups", () => {
  it("mantém a ordem dos grupos e leva rótulo e ícone de cada item", () => {
    const groups: StackGroup[] = [
      {
        title: "Linguagens",
        items: [
          { key: "typescript", label: "TypeScript", icon: "siTypescript" },
          { key: "elixir", label: "Elixir" },
        ],
      },
    ];
    expect(toStackGroups(groups)).toEqual([
      {
        title: "Linguagens",
        items: [
          { key: "typescript", label: "TypeScript", icon: "siTypescript" },
          { key: "elixir", label: "Elixir", icon: undefined },
        ],
      },
    ]);
  });
});
