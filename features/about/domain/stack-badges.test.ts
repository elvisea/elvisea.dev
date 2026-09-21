import { describe, expect, it } from "bun:test";

import type { StackItem } from "@/lib/content/types";

import { toStackBadges } from "./stack-badges";

const items: Record<string, StackItem> = {
  typescript: { key: "typescript", label: "TypeScript", icon: "siTypescript" },
  elixir: { key: "elixir", label: "Elixir" },
};

describe("toStackBadges", () => {
  it("usa rótulo e ícone do item da stack", () => {
    expect(toStackBadges(["typescript"], (key) => items[key])).toEqual([
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
    ]);
  });

  it("item sem ícone e chave desconhecida aparecem sem ícone", () => {
    expect(toStackBadges(["elixir", "cobol"], (key) => items[key])).toEqual([
      { key: "elixir", label: "Elixir", icon: undefined },
      { key: "cobol", label: "cobol", icon: undefined },
    ]);
  });
});
