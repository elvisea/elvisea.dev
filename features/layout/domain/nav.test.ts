import { describe, expect, it } from "bun:test";

import { isActiveNavItem, markActiveNav } from "./nav";

describe("isActiveNavItem", () => {
  it("casa a própria rota e as páginas abaixo dela", () => {
    expect(isActiveNavItem("/blog", "/blog")).toBe(true);
    expect(isActiveNavItem("/blog", "/blog/meu-post")).toBe(true);
  });

  it("não casa outra rota nem prefixo parcial", () => {
    expect(isActiveNavItem("/blog", "/")).toBe(false);
    expect(isActiveNavItem("/servicos", "/servicos-antigos")).toBe(false);
  });
});

describe("markActiveNav", () => {
  it("marca só o item da rota atual", () => {
    expect(
      markActiveNav(
        [
          { href: "/blog", label: "Blog" },
          { href: "/sobre", label: "Sobre" },
        ],
        "/blog/post",
      ),
    ).toEqual([
      { href: "/blog", label: "Blog", active: true },
      { href: "/sobre", label: "Sobre", active: false },
    ]);
  });
});
