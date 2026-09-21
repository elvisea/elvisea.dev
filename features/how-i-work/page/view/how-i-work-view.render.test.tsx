import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { comoTrabalhoPage } from "@/content/pt-BR/pages/profissional";
import type { HowIWorkViewModel } from "@/features/how-i-work/page/view-model/get-how-i-work-view-model";

import { HowIWorkView } from "./how-i-work-view";

const model: HowIWorkViewModel = {
  header: comoTrabalhoPage.header,
  html: "<h2>Contexto</h2><p>Texto.</p>",
  breadcrumb: [{ name: "Como trabalho", path: "/como-trabalho" }],
  metadata: {},
};

describe("HowIWorkView", () => {
  it("h1 do cabeçalho e o texto renderizado do Markdown", () => {
    render(<HowIWorkView model={model} />);
    expect(
      screen.getByRole("heading", { level: 1, name: model.header.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Contexto" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Texto.")).toBeInTheDocument();
  });
});
