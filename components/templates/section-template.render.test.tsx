import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { SectionTemplate } from "./section-template";

describe("SectionTemplate", () => {
  it("é uma seção com âncora, cabeçalho h2 e conteúdo", () => {
    const { container } = render(
      <SectionTemplate
        header={{ eyebrow: "Serviços", title: "O que eu faço" }}
        id="servicos"
      >
        <p>cards</p>
      </SectionTemplate>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "servicos");
    expect(section).not.toHaveClass("bg-surface");
    expect(
      screen.getByRole("heading", { level: 2, name: "O que eu faço" }),
    ).toBeInTheDocument();
    expect(screen.getByText("cards")).toBeInTheDocument();
  });

  it("usa o fundo surface para alternar as seções", () => {
    const { container } = render(
      <SectionTemplate header={{ eyebrow: "a", title: "b" }} surface>
        <p>c</p>
      </SectionTemplate>,
    );
    expect(container.querySelector("section")).toHaveClass("bg-surface");
  });
});
