import { describe, expect, it } from "bun:test";

import { site } from "@/content/pt-BR/site";

import {
  getSiteFooterViewModel,
  getSiteHeaderViewModel,
} from "./get-layout-view-model";

describe("getSiteHeaderViewModel", () => {
  const model = getSiteHeaderViewModel();

  it("leva o menu, o link da home e os rótulos de acessibilidade", () => {
    expect(model.navigation).toBe(site.navigation);
    expect(model.home).toEqual({
      href: "/",
      name: site.person.name,
      domain: site.domain,
      hint: site.a11y.homeLinkHint,
    });
    expect(model.labels.mainNav).toBe(site.a11y.mainNav);
    expect(model.labels.openMenu).toBe(site.a11y.openMenu);
    expect(model.sheet).toEqual({
      name: site.person.name,
      role: site.person.role,
    });
  });

  it("leva os links externos e os textos do tema", () => {
    expect(model.externalLinks).toEqual(
      Object.values(site.links).map(({ href, label }) => ({ href, label })),
    );
    expect(model.theme).toBe(site.theme);
  });
});

describe("getSiteFooterViewModel", () => {
  it("usa o ano recebido no aviso de direitos", () => {
    expect(
      getSiteFooterViewModel(new Date("2030-02-01T00:00:00Z")).copyright,
    ).toEqual({ year: "2030", holder: site.footer.copyright });
  });

  it("separa menu, páginas do rodapé e links externos", () => {
    const model = getSiteFooterViewModel();
    expect(model.navigation).toBe(site.navigation);
    expect(model.pages).toBe(site.footerLinks);
    expect(model.externalLinks.map((link) => link.label)).toEqual(
      Object.values(site.links).map((link) => link.label),
    );
  });
});
