import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import type { StackGroupModel } from "@/features/about/profile/view-model/get-about-view-model";

import { StackGrid } from "./stack-grid";

const groups: StackGroupModel[] = [
  {
    title: "Linguagens",
    items: [
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
      { key: "elixir", label: "Elixir" },
    ],
  },
  { title: "Dados", items: [{ key: "postgres", label: "PostgreSQL" }] },
];

describe("StackGrid", () => {
  it("um card por grupo, com a lista nomeada pelo título", () => {
    render(<StackGrid groups={groups} />);
    expect(screen.getByText("Linguagens")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Linguagens" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Dados" })).toBeInTheDocument();
  });

  it("o título do grupo é um rótulo próprio dentro do card", () => {
    render(<StackGrid groups={groups} />);
    expect(screen.getByText("Linguagens").tagName).toBe("P");
  });

  it("item com ícone mostra o SVG decorativo; sem ícone, só o rótulo", () => {
    render(<StackGrid groups={groups} />);
    const comIcone = screen.getByText("TypeScript").closest("span");
    const semIcone = screen.getByText("Elixir").closest("span");
    expect(comIcone?.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(semIcone?.querySelector("svg")).toBeNull();
  });
});
