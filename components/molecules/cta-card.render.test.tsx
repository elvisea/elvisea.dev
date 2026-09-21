import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { CtaCard } from "./cta-card";

describe("CtaCard", () => {
  it("mostra título, texto e o botão com o link", () => {
    render(
      <CtaCard
        cta="Falar sobre o projeto"
        description="Conte o que precisa."
        href="/contato?assunto=projeto"
        title="Tem um projeto?"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Tem um projeto?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Conte o que precisa.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Falar sobre o projeto" }),
    ).toHaveAttribute("href", "/contato?assunto=projeto");
  });
});
