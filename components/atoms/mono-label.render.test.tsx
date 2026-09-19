import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { Eyebrow } from "./eyebrow";
import { MonoLabel } from "./mono-label";

describe("MonoLabel", () => {
  it("renderiza o elemento pedido, com o estilo de rótulo", () => {
    render(<MonoLabel as="h2">Atuação</MonoLabel>);
    const heading = screen.getByRole("heading", { level: 2, name: "Atuação" });
    expect(heading).toHaveClass("font-mono", "uppercase", "text-highlight");
  });

  it("é um parágrafo quando não há nível de título", () => {
    render(<MonoLabel>Stack</MonoLabel>);
    expect(screen.getByText("Stack").tagName).toBe("P");
  });
});

describe("Eyebrow", () => {
  it("renderiza um parágrafo em mono na cor de destaque", () => {
    render(<Eyebrow>Serviços</Eyebrow>);
    const eyebrow = screen.getByText("Serviços");
    expect(eyebrow.tagName).toBe("P");
    expect(eyebrow).toHaveClass("font-mono", "text-highlight");
  });
});
