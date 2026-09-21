import { describe, expect, it } from "bun:test";

import type { Certificate, Education } from "@/lib/content/types";

import { toCertificateModel, toEducationModel } from "./credentials";

describe("toEducationModel", () => {
  it("monta o período quando há início e fim", () => {
    expect(
      toEducationModel({
        institution: "UTFPR",
        degree: "Bacharelado",
        field: "Sistemas",
        startYear: 2019,
        endYear: 2023,
      } as Education),
    ).toEqual({
      institution: "UTFPR",
      degree: "Bacharelado",
      field: "Sistemas",
      years: "2019 – 2023",
    });
  });

  it("sem fim, não mostra período", () => {
    expect(
      toEducationModel({
        institution: "X",
        degree: "Tecnólogo",
        field: "ADS",
        startYear: 2019,
      } as Education).years,
    ).toBeNull();
  });
});

describe("toCertificateModel", () => {
  const base = {
    slug: "curso",
    title: "Curso",
    issuer: "Escola",
    visible: true,
  } as Certificate;

  it("com data, devolve rótulo e o ISO para o <time>", () => {
    expect(
      toCertificateModel({ ...base, issued: "2025-06" }, "sem data").date,
    ).toEqual({ label: "jun/2025", iso: "2025-06" });
  });

  it("sem data, usa o rótulo recebido e não tem ISO", () => {
    expect(toCertificateModel(base, "sem data").date).toEqual({
      label: "sem data",
    });
  });
});
