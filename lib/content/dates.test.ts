import { describe, expect, it } from "bun:test";

import {
  formatDuration,
  formatPeriod,
  formatYearMonth,
  isYearMonth,
  monthsBetween,
} from "./dates";

describe("datas do conteúdo", () => {
  it("valida YYYY-MM", () => {
    expect(isYearMonth("2026-02")).toBe(true);
    expect(isYearMonth("2026-13")).toBe(false);
    expect(isYearMonth("2026-2")).toBe(false);
  });

  it("formata mês abreviado em PT-BR", () => {
    expect(formatYearMonth("2026-02")).toBe("fev/2026");
    expect(formatYearMonth("2020-12")).toBe("dez/2020");
  });

  it("conta meses de forma inclusiva", () => {
    expect(monthsBetween("2020-01", "2020-09")).toBe(9);
    expect(monthsBetween("2025-03", "2025-06")).toBe(4);
    expect(monthsBetween("2022-05", "2024-04")).toBe(24);
  });

  it("escreve a duração por extenso", () => {
    expect(formatDuration(1)).toBe("1 mês");
    expect(formatDuration(9)).toBe("9 meses");
    expect(formatDuration(12)).toBe("1 ano");
    expect(formatDuration(14)).toBe("1 ano e 2 meses");
    expect(formatDuration(25)).toBe("2 anos e 1 mês");
  });

  it("monta o período com vínculo atual a partir de now", () => {
    const now = new Date(Date.UTC(2026, 8, 17));
    expect(formatPeriod("2026-02", null, now)).toBe(
      "fev/2026 – atual · 8 meses",
    );
    expect(formatPeriod("2025-08", "2026-05", now)).toBe(
      "ago/2025 – mai/2026 · 10 meses",
    );
  });
});
