/**
 * Formatação de períodos (`YYYY-MM`) no estilo usado pelo LinkedIn em PT-BR:
 * "fev/2026 – atual · 8 meses".
 *
 * Funções puras: `now` é injetável para testes. Em produção, o valor é o
 * momento do build (o site é estático).
 */
import type { YearMonth } from "./types";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

const YEAR_MONTH_REGEX = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function isYearMonth(value: string): value is YearMonth {
  return YEAR_MONTH_REGEX.test(value);
}

function parts(value: YearMonth): { year: number; month: number } {
  const match = YEAR_MONTH_REGEX.exec(value);
  if (!match) throw new Error(`Data inválida (esperado YYYY-MM): "${value}"`);
  return { year: Number(match[1]), month: Number(match[2]) };
}

export function toYearMonth(date: Date): YearMonth {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}` as YearMonth;
}

/** "2026-02" → "fev/2026". */
export function formatYearMonth(value: YearMonth): string {
  const { year, month } = parts(value);
  return `${MONTHS[month - 1]}/${year}`;
}

/** Diferença inclusiva em meses, como o LinkedIn (jan–set = 9 meses). */
export function monthsBetween(start: YearMonth, end: YearMonth): number {
  const a = parts(start);
  const b = parts(end);
  return (b.year - a.year) * 12 + (b.month - a.month) + 1;
}

/** 14 → "1 ano e 2 meses"; 12 → "1 ano"; 1 → "1 mês". */
export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const y = years === 1 ? "1 ano" : `${years} anos`;
  const m = months === 1 ? "1 mês" : `${months} meses`;
  if (years === 0) return m;
  if (months === 0) return y;
  return `${y} e ${m}`;
}

/** "fev/2026 – atual · 8 meses". */
export function formatPeriod(
  start: YearMonth,
  end: YearMonth | null,
  now: Date = new Date(),
): string {
  const endValue = end ?? toYearMonth(now);
  const range = `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "atual"}`;
  return `${range} · ${formatDuration(monthsBetween(start, endValue))}`;
}
