import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { HeroSection } from "./hero-section";

const model = {
  location: "Curitiba, Paraná, Brasil",
  name: "Elvis Amancio",
  role: "Desenvolvedor Full-Stack Sênior",
  stackLabel: "Principais tecnologias",
  stack: ["TypeScript", "NestJS"],
  actions: [
    { href: "/curriculo", label: "Currículo" },
    { href: "/servicos", label: "Serviços para empresas" },
    { href: "https://linkedin.com/in/x", label: "LinkedIn", external: true },
  ],
};

describe("HeroSection", () => {
  it("h1 único com nome e cargo", () => {
    render(<HeroSection model={model} />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(`${model.name} — ${model.role}`);
  });

  it("stack numa lista com nome acessível", () => {
    render(<HeroSection model={model} />);
    const list = screen.getByRole("list", { name: model.stackLabel });
    expect(list.querySelectorAll("li")).toHaveLength(2);
  });

  it("links internos e externos, com nova aba só nos externos", () => {
    render(<HeroSection model={model} />);
    expect(screen.getByRole("link", { name: "Currículo" })).not.toHaveAttribute(
      "target",
    );
    const externo = screen.getByRole("link", { name: "LinkedIn" });
    expect(externo).toHaveAttribute("target", "_blank");
    expect(externo).toHaveAttribute("rel", "noopener noreferrer");
  });
});
