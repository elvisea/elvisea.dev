import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { ArrowLink } from "./arrow-link";

describe("ArrowLink", () => {
  it("avança: link interno com a seta depois do texto", () => {
    render(<ArrowLink href="/projetos">Ver projetos</ArrowLink>);
    const link = screen.getByRole("link", { name: "Ver projetos" });
    expect(link).toHaveAttribute("href", "/projetos");
    expect(link).not.toHaveAttribute("target");
    expect(link.lastElementChild?.tagName).toBe("svg");
    expect(link).toHaveClass("min-h-11");
  });

  it("volta: seta antes do texto e tamanho pequeno", () => {
    render(
      <ArrowLink direction="back" href="/blog" size="sm">
        Todos os artigos
      </ArrowLink>,
    );
    const link = screen.getByRole("link", { name: "Todos os artigos" });
    expect(link.firstElementChild?.tagName).toBe("svg");
    expect(link).toHaveClass("text-sm");
  });

  it("externo: abre em nova aba sem expor a página de origem", () => {
    render(
      <ArrowLink direction="external" href="https://github.com/elvisea">
        GitHub
      </ArrowLink>,
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("repassa atributos, como tirar o link da ordem de foco", () => {
    render(
      <ArrowLink aria-hidden href="/servicos/x" tabIndex={-1}>
        Ver serviço
      </ArrowLink>,
    );
    const link = screen.getByText("Ver serviço").closest("a");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("aria-hidden", "true");
  });
});
