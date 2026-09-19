import { afterEach, describe, expect, it } from "bun:test";

import { isRateLimited, resetRateLimitForTests } from "./rate-limit";

describe("isRateLimited", () => {
  afterEach(() => {
    resetRateLimitForTests();
  });

  it("permite a primeira requisição", () => {
    expect(isRateLimited("k1")).toBe(false);
  });

  it("permite até `max` requisições no intervalo", () => {
    expect(isRateLimited("k1", 3, 60_000)).toBe(false);
    expect(isRateLimited("k1", 3, 60_000)).toBe(false);
    expect(isRateLimited("k1", 3, 60_000)).toBe(false);
  });

  it("bloqueia a `max + 1`-ésima requisição na mesma janela", () => {
    isRateLimited("k1", 3, 60_000);
    isRateLimited("k1", 3, 60_000);
    isRateLimited("k1", 3, 60_000);
    expect(isRateLimited("k1", 3, 60_000)).toBe(true);
  });

  it("isola por chave", () => {
    isRateLimited("k1", 1, 60_000);
    expect(isRateLimited("k1", 1, 60_000)).toBe(true);
    expect(isRateLimited("k2", 1, 60_000)).toBe(false);
  });

  it("libera depois da janela expirar", () => {
    const start = 1_000_000;
    isRateLimited("k1", 1, 60_000, start);
    expect(isRateLimited("k1", 1, 60_000, start + 59_999)).toBe(true);
    expect(isRateLimited("k1", 1, 60_000, start + 60_000)).toBe(false);
  });
});
