import { afterEach, describe, expect, it } from "bun:test";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getSiteHeaderViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

import { SiteHeader } from "./site-header";

const model = getSiteHeaderViewModel();

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("SiteHeader", () => {
  it("marca a rota atual com aria-current", () => {
    window.history.pushState({}, "", "/blog/meu-post");
    render(<SiteHeader model={model} />);
    const nav = screen.getByRole("navigation", { name: model.labels.mainNav });
    expect(within(nav).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Sobre" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("link da marca leva à home, com complemento para leitor de tela", () => {
    render(<SiteHeader model={model} />);
    expect(
      screen.getByRole("link", {
        name: new RegExp(`${model.home.name}.*${model.home.hint}`),
      }),
    ).toHaveAttribute("href", "/");
  });

  it("o menu mobile abre com os mesmos itens e os links externos", async () => {
    render(<SiteHeader model={model} />);
    const button = screen.getByRole("button", { name: model.labels.openMenu });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    const mobileNav = await screen.findByRole("navigation", {
      name: model.labels.mobileNav,
    });
    // O SheetClose do Base UI marca os itens com role="button", mesmo sendo
    // âncoras com href (comportamento do componente, não do model).
    const items = within(mobileNav).getAllByRole("button");
    expect(items).toHaveLength(model.navigation.length);
    expect(items.map((item) => item.getAttribute("href"))).toEqual(
      model.navigation.map((item) => item.href),
    );
    for (const link of model.externalLinks) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });
});
