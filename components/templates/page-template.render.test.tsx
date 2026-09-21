import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { PageTemplate } from "./page-template";

const header = {
  eyebrow: "Projetos",
  title: "Projetos e código aberto",
  description: "Repositórios públicos.",
};

describe("PageTemplate", () => {
  it("abre a página com o h1 do cabeçalho e o conteúdo depois", () => {
    render(
      <PageTemplate header={header}>
        <p>conteúdo</p>
      </PageTemplate>,
    );
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Projetos e código aberto");
    expect(screen.getByText("Projetos")).toBeInTheDocument();
    expect(screen.getByText("Repositórios públicos.")).toBeInTheDocument();
    expect(
      h1.compareDocumentPosition(screen.getByText("conteúdo")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("sem cabeçalho, o conteúdo traz o próprio h1", () => {
    render(
      <PageTemplate>
        <h1>Título próprio</h1>
      </PageTemplate>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("aplica a largura pedida", () => {
    const { container } = render(
      <PageTemplate width="narrow">
        <p>texto</p>
      </PageTemplate>,
    );
    expect(container.firstElementChild).toHaveClass("max-w-3xl");
    expect(container.firstElementChild).not.toHaveClass("max-w-6xl");
  });
});
