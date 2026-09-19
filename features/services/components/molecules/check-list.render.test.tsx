import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { CheckList } from "./check-list";

describe("CheckList", () => {
  it("lista cada item, com o ícone fora da árvore de acessibilidade", () => {
    render(<CheckList items={["Empresas com WhatsApp", "Times sem TI"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Empresas com WhatsApp",
      "Times sem TI",
    ]);
    expect(items[0].querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
