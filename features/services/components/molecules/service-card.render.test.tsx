import { describe, expect, it } from "bun:test";

import { render, screen, within } from "@testing-library/react";

import { ServiceCard } from "./service-card";

const service = {
  slug: "chatbot",
  href: "/servicos/chatbot",
  title: "Chatbot com IA",
  summary: "Atendimento automático no WhatsApp.",
  stack: ["typescript"],
};

describe("ServiceCard", () => {
  it("o título é o link da página do serviço, no nível pedido", () => {
    render(
      <ServiceCard
        headingLevel="h2"
        moreLabel="Ver serviço"
        service={service}
        stackLabel="Tecnologias"
      />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(
      within(heading).getByRole("link", { name: "Chatbot com IA" }),
    ).toHaveAttribute("href", "/servicos/chatbot");
    expect(
      screen.getByText("Atendimento automático no WhatsApp."),
    ).toBeInTheDocument();
  });

  it("lista as tecnologias com o rótulo recebido", () => {
    render(
      <ServiceCard
        moreLabel="Ver serviço"
        service={service}
        stackLabel="Tecnologias"
      />,
    );
    expect(
      screen.getByRole("list", { name: "Tecnologias" }),
    ).toBeInTheDocument();
  });

  it("o link de rodapé repete o destino fora da ordem de foco", () => {
    render(
      <ServiceCard
        moreLabel="Ver serviço"
        service={service}
        stackLabel="Tecnologias"
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    const more = screen.getByText("Ver serviço").closest("a");
    expect(more).toHaveAttribute("href", "/servicos/chatbot");
    expect(more).toHaveAttribute("tabindex", "-1");
  });
});
