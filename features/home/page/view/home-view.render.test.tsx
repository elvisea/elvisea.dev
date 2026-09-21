import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getHomeViewModel } from "@/features/home/page/view-model/get-home-view-model";

import { HomeView } from "./home-view";

describe("HomeView", () => {
  it("tem um h1 só e uma seção por área, na ordem do site", async () => {
    const model = await getHomeViewModel();
    const { container } = render(<HomeView model={model} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    // A prévia do blog só aparece quando há post publicado.
    const esperado = [
      "perfil",
      "servicos",
      "experiencia",
      "projetos",
      "stack",
      ...(model.blog.posts.length > 0 ? ["blog"] : []),
      "contato",
    ];
    expect(
      [...container.querySelectorAll("section[id]")].map((s) => s.id),
    ).toEqual(esperado);
  });

  it("leva ao contato pelo botão da última seção", async () => {
    const model = await getHomeViewModel();
    render(<HomeView model={model} />);
    expect(
      screen.getByRole("link", { name: model.contact.cta.label }),
    ).toHaveAttribute("href", "/contato");
  });
});
