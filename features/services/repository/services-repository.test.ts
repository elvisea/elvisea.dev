/**
 * Repository e invariantes do conteúdo de serviços (`content/pt-BR/servicos.ts`).
 */
import { describe, expect, it } from "bun:test";

import { experiencias } from "@/content/pt-BR/experiencias";
import { servicos } from "@/content/pt-BR/servicos";
import { site } from "@/content/pt-BR/site";
import { stack } from "@/content/pt-BR/stack";
import { getProjects } from "@/lib/projects";

import {
  createServicesRepository,
  servicesRepository,
} from "./services-repository";
import type { Service } from "./types";

const sample = [
  { slug: "a", shortTitle: "A" },
  { slug: "b", shortTitle: "B" },
] as unknown as readonly Service[];

describe("createServicesRepository", () => {
  it("lista na ordem do conteúdo e encontra por slug", () => {
    const repository = createServicesRepository(sample);
    expect(repository.list().map((s) => s.slug)).toEqual(["a", "b"]);
    expect(repository.findBySlug("b")?.shortTitle).toBe("B");
    expect(repository.findBySlug("x")).toBeUndefined();
  });

  it("o repository padrão lê content/pt-BR/servicos.ts", () => {
    expect(servicesRepository.list()).toBe(servicos);
  });
});

describe("conteúdo de serviços", () => {
  const stackKeys = new Set<string>(
    stack.flatMap((group) => group.items.map((item) => item.key)),
  );
  const experienceSlugs = new Set<string>(experiencias.map((e) => e.slug));
  // Repositórios que o próprio site exibe em /projetos (curadoria aplicada).
  const shownRepos = new Set(getProjects().map((project) => project.repoUrl));

  it("tem slugs únicos em formato de URL", () => {
    const slugs = servicos.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(servicos.map((s) => [s.slug, s] as const))(
    "%s respeita os limites de título e descrição (AGENTS.md § SEO)",
    (_, service) => {
      expect(
        `${service.metaTitle} · ${site.person.name}`.length,
      ).toBeLessThanOrEqual(60);
      expect(service.metaDescription.length).toBeGreaterThanOrEqual(70);
      expect(service.metaDescription.length).toBeLessThanOrEqual(160);
    },
  );

  it.each(servicos.map((s) => [s.slug, s] as const))(
    "%s tem seções preenchidas, stack existente e evidências com link válido",
    (_, service) => {
      expect(service.forWho.length).toBeGreaterThan(0);
      expect(service.deliverables.length).toBeGreaterThan(0);
      expect(service.process.length).toBeGreaterThan(0);
      expect(service.evidence.length).toBeGreaterThan(0);
      for (const key of service.stack) expect(stackKeys.has(key)).toBe(true);

      for (const item of service.evidence as Service["evidence"]) {
        if (item.kind === "experiencia") {
          expect(item.href).toMatch(/^\/experiencia#/);
          expect(experienceSlugs.has(item.href!.split("#")[1]!)).toBe(true);
        }
        if (item.kind === "codigo-aberto") {
          // Só repositórios públicos que o site também exibe.
          expect(shownRepos.has(item.href ?? "")).toBe(true);
        }
        // Projeto próprio sem link: pode ser de nicho que não se nomeia.
        if (item.kind === "projeto-proprio") expect(item.href).toBeUndefined();
      }
    },
  );

  it("não cita nicho sensível, empregador interno, preço nem prazo", () => {
    const text = JSON.stringify(servicos).toLowerCase();
    // Palavra inteira: "conversou" não pode disparar "converso".
    const forbidden = [
      /\bviki\b/,
      /\bstayclose\b/,
      /\blottopar\b/,
      /\baerobi\b/,
      /\bconverso\b/,
      /\bprobitech\b/,
      /r\$/,
      /garant/,
      /\bprazos?\b/,
      /(?<![a-zà-ú])(licita|salári)/,
      /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/,
    ];
    expect(forbidden.filter((term) => term.test(text))).toEqual([]);
  });

  it("chatbot de WhatsApp avisa que não usa a API oficial", () => {
    const chatbot: Service | undefined = servicesRepository.findBySlug(
      "chatbot-ia-whatsapp",
    );
    expect(chatbot?.note).toContain("sem a API oficial");
  });
});
