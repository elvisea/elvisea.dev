import { afterEach, describe, expect, it } from "bun:test";

import { act, renderHook } from "@testing-library/react";

import { useSiteHeaderViewModel } from "./use-site-header-view-model";

const navigation = [
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
];

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("useSiteHeaderViewModel", () => {
  it("marca o item da rota atual, inclusive em páginas abaixo dela", () => {
    window.history.pushState({}, "", "/blog/meu-post");
    const { result } = renderHook(() => useSiteHeaderViewModel(navigation));
    expect(result.current.links.map((link) => link.active)).toEqual([
      true,
      false,
    ]);
  });

  it("o menu mobile começa fechado e abre pelo handler", () => {
    const { result } = renderHook(() => useSiteHeaderViewModel(navigation));
    expect(result.current.mobileOpen).toBe(false);
    act(() => result.current.setMobileOpen(true));
    expect(result.current.mobileOpen).toBe(true);
  });
});
