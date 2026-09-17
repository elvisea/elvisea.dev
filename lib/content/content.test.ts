/**
 * Invariantes do conteúdo profissional que o sistema de tipos não garante.
 * Falha no CI se um dado copiado do LinkedIn/KB entrar incoerente.
 */
import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import path from "node:path";

import { certificados } from "@/content/pt-BR/certificados";
import {
  comoTrabalhoPage,
  curriculoPage,
} from "@/content/pt-BR/pages/profissional";
import { experiencias } from "@/content/pt-BR/experiencias";
import { formacao } from "@/content/pt-BR/formacao";
import { perfil } from "@/content/pt-BR/perfil";
import { site } from "@/content/pt-BR/site";
import { stack } from "@/content/pt-BR/stack";

import { isYearMonth } from "./dates";
import { techIcons } from "./icons";
import type { Experience } from "./types";

const stackKeys = new Set<string>(
  stack.flatMap((group) => group.items.map((item) => item.key)),
);

describe("experiências", () => {
  const list: readonly Experience[] = experiencias;

  it("têm datas válidas e início antes do fim", () => {
    for (const exp of list) {
      expect(isYearMonth(exp.start)).toBe(true);
      if (exp.end !== null) {
        expect(isYearMonth(exp.end)).toBe(true);
        expect(exp.start <= exp.end).toBe(true);
      }
    }
  });

  it("estão ordenadas da mais recente para a mais antiga", () => {
    const starts = list.map((exp) => exp.start);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  it("têm slugs únicos em formato de âncora", () => {
    const slugs = list.map((exp) => exp.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("só usam chaves de stack existentes", () => {
    for (const exp of list) {
      for (const key of exp.stack) expect(stackKeys.has(key)).toBe(true);
    }
  });

  it("não linkam a página da Trio (regra de conteúdo)", () => {
    const trio = list.find((exp) => exp.slug === "trio");
    expect(trio).toBeDefined();
    expect(trio?.companyUrl).toBeUndefined();
  });

  it("têm pelo menos uma em destaque para a home", () => {
    expect(list.some((exp) => exp.highlight)).toBe(true);
  });
});

describe("stack", () => {
  it("tem chaves únicas e ícones existentes", () => {
    const keys = stack.flatMap((group) => group.items.map((item) => item.key));
    expect(new Set(keys).size).toBe(keys.length);
    for (const group of stack) {
      for (const item of group.items) {
        if (item.icon) expect(techIcons[item.icon]).toBeDefined();
      }
    }
  });
});

describe("certificados e formação", () => {
  it("têm datas válidas e links https nos visíveis", () => {
    for (const cert of certificados) {
      if (cert.issued) expect(isYearMonth(cert.issued)).toBe(true);
      if (cert.url) expect(cert.url.startsWith("https://")).toBe(true);
    }
    expect(new Set(certificados.map((c) => c.slug)).size).toBe(
      certificados.length,
    );
  });

  it("formação tem anos coerentes", () => {
    for (const item of formacao) {
      if (item.startYear && item.endYear) {
        expect(item.startYear <= item.endYear).toBe(true);
      }
    }
  });
});

describe("currículo", () => {
  it("os PDFs referenciados existem em public/", () => {
    for (const file of curriculoPage.files) {
      expect(existsSync(path.join(process.cwd(), "public", file.href))).toBe(
        true,
      );
    }
  });
});

describe("regras de conteúdo", () => {
  const texts = JSON.stringify({
    site,
    perfil,
    experiencias,
    formacao,
    certificados,
    comoTrabalhoPage,
    curriculoPage,
  });

  it("não expõem telefone", () => {
    expect(texts).not.toMatch(/\(?\d{2}\)?\s?9?\d{4}-?\d{4}/);
    expect(texts.toLowerCase()).not.toContain("tel:");
  });

  it("não citam licitação nem salário", () => {
    // Início de palavra: "solicitações" contém "licita" e não pode disparar.
    expect(texts.toLowerCase()).not.toMatch(
      /(?<![a-zà-ú])(licita|salári|pretensão salarial)/,
    );
  });
});
