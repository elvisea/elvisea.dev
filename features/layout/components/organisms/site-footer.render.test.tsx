import { describe, expect, it } from "bun:test";

import { render, screen, within } from "@testing-library/react";

import { getSiteFooterViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

import { SiteFooter } from "./site-footer";

const model = getSiteFooterViewModel(new Date("2026-05-01T00:00:00Z"));

describe("SiteFooter", () => {
  it("mostra identificação e o aviso de direitos com o ano recebido", () => {
    render(<SiteFooter model={model} />);
    expect(screen.getByText(model.person.name)).toBeInTheDocument();
    expect(
      screen.getByText(`© ${model.copyright.year} ${model.copyright.holder}`),
    ).toBeInTheDocument();
  });

  it("navegação, páginas do rodapé e links externos em nova aba", () => {
    render(<SiteFooter model={model} />);
    const nav = screen.getByRole("navigation", {
      name: model.labels.footerNav,
    });
    expect(within(nav).getAllByRole("link")).toHaveLength(
      model.navigation.length + model.pages.length + model.externalLinks.length,
    );
    const externo = screen.getByRole("link", {
      name: model.externalLinks[0]!.label,
    });
    expect(externo).toHaveAttribute("target", "_blank");
    expect(externo).toHaveAttribute("rel", "noopener noreferrer");
  });
});
