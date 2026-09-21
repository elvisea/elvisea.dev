import { describe, expect, it } from "bun:test";

import { act, renderHook } from "@testing-library/react";

import type { ProjectCardModel } from "@/features/projects/domain/project-card";

import { ALL_LANGUAGES, buildLanguageOptions } from "./project-filter";
import { useProjectFilterViewModel } from "./use-project-filter-view-model";

const cards = [
  { slug: "a", language: "TypeScript" },
  { slug: "b", language: "Elixir" },
  { slug: "c", language: "TypeScript" },
] as ProjectCardModel[];

const options = buildLanguageOptions(
  3,
  [
    { language: "TypeScript", count: 2 },
    { language: "Elixir", count: 1 },
  ],
  { all: "Todas", count: (n) => `${n} projetos` },
);

describe("useProjectFilterViewModel", () => {
  it("começa com todos os projetos", () => {
    const { result } = renderHook(() =>
      useProjectFilterViewModel(cards, options),
    );
    expect(result.current.language).toBe(ALL_LANGUAGES);
    expect(result.current.visible).toHaveLength(3);
    expect(result.current.resultLabel).toBe("3 projetos");
  });

  it("filtra pela linguagem escolhida", () => {
    const { result } = renderHook(() =>
      useProjectFilterViewModel(cards, options),
    );
    act(() => result.current.select(["Elixir"]));
    expect(result.current.visible.map((card) => card.slug)).toEqual(["b"]);
    expect(result.current.resultLabel).toBe("1 projetos");
  });

  it("clicar na opção ativa (seleção vazia) mantém o filtro", () => {
    const { result } = renderHook(() =>
      useProjectFilterViewModel(cards, options),
    );
    act(() => result.current.select(["TypeScript"]));
    act(() => result.current.select([]));
    expect(result.current.language).toBe("TypeScript");
    expect(result.current.visible).toHaveLength(2);
  });
});
