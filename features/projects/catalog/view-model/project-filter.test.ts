import { describe, expect, it } from "bun:test";

import type { ProjectCardModel } from "@/features/projects/domain/project-card";

import {
  ALL_LANGUAGES,
  buildLanguageOptions,
  filterProjectsByLanguage,
} from "./project-filter";

const texts = {
  all: "Todas",
  count: (n: number) => (n === 1 ? "1 projeto" : `${n} projetos`),
};

describe("buildLanguageOptions", () => {
  it("começa por Todas, com o total, e traz o texto do contador", () => {
    expect(
      buildLanguageOptions(
        3,
        [
          { language: "TypeScript", count: 2 },
          { language: "Elixir", count: 1 },
        ],
        texts,
      ),
    ).toEqual([
      {
        value: ALL_LANGUAGES,
        label: "Todas",
        count: 3,
        resultLabel: "3 projetos",
      },
      {
        value: "TypeScript",
        label: "TypeScript",
        count: 2,
        resultLabel: "2 projetos",
      },
      { value: "Elixir", label: "Elixir", count: 1, resultLabel: "1 projeto" },
    ]);
  });
});

describe("filterProjectsByLanguage", () => {
  const cards = [
    { slug: "a", language: "TypeScript" },
    { slug: "b", language: "Elixir" },
    { slug: "c", language: null },
  ] as ProjectCardModel[];

  it("Todas devolve a lista inteira", () => {
    expect(filterProjectsByLanguage(cards, ALL_LANGUAGES)).toBe(cards);
  });

  it("uma linguagem devolve só os projetos dela", () => {
    expect(
      filterProjectsByLanguage(cards, "Elixir").map((card) => card.slug),
    ).toEqual(["b"]);
  });
});
