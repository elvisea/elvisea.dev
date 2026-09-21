import { describe, expect, it } from "bun:test";

import { homePage } from "@/content/pt-BR/pages/profissional";
import { site } from "@/content/pt-BR/site";
import { createAboutRepository } from "@/features/about/repository/about-repository";
import type { BlogRepository } from "@/features/blog/repository/blog-repository";
import type { PostSummary } from "@/features/blog/repository/schema";
import { createExperienceRepository } from "@/features/experience/repository/experience-repository";
import type { ProjectsRepository } from "@/features/projects/repository/projects-repository";
import type { Project } from "@/features/projects/repository/types";
import { createServicesRepository } from "@/features/services/repository/services-repository";
import type { Service } from "@/features/services/repository/types";
import type { Experience } from "@/lib/content/types";

import { getHomeViewModel } from "./get-home-view-model";

const post = (slug: string): PostSummary => ({
  slug,
  frontmatter: {
    title: `Post ${slug}`,
    description: "Descrição com tamanho suficiente para a meta description.",
    date: "2026-03-01",
    tags: [],
    draft: false,
  },
  readingMinutes: 3,
});

const project = (slug: string): Project => ({
  slug,
  source: "github",
  title: slug,
  summary: `Resumo de ${slug}`,
  language: "TypeScript",
  tags: [],
  repoUrl: `https://github.com/elvisea/${slug}`,
  liveUrl: null,
  stars: 0,
  fork: false,
  updatedAt: null,
  caseStudy: false,
});

const experience = (slug: string, highlight?: boolean): Experience =>
  ({
    slug,
    role: "Dev",
    company: slug,
    start: "2024-01",
    end: null,
    mode: "remoto",
    location: "Curitiba",
    summary: ["Um.", "Dois."],
    groups: [{ title: "Entregas", bullets: ["b"] }],
    stack: ["typescript"],
    highlight,
  }) as unknown as Experience;

/** Repositories falsos: a home não toca no filesystem nem no conteúdo real. */
const repositories = {
  about: createAboutRepository({
    profile: {
      resumo: "Resumo do perfil.",
      atuacao: ["Atuação"],
      engenhariaComIa: "IA.",
      projetosProprios: "Projetos.",
    },
    stack: [
      {
        title: "Linguagens",
        items: [{ key: "typescript", label: "TypeScript" }],
      },
    ],
    education: [],
    certificates: [],
  }),
  experiences: createExperienceRepository([
    experience("atual", true),
    experience("anterior"),
  ]),
  services: createServicesRepository([
    {
      slug: "chatbot",
      shortTitle: "Chatbot",
      title: "Chatbot com IA",
      summary: "Resumo.",
      stack: ["typescript"],
    },
  ] as unknown as readonly Service[]),
  projects: {
    featured: (limit: number) => [project("a"), project("b")].slice(0, limit),
  } as unknown as ProjectsRepository,
  blog: {
    recent: async (limit: number) => [post("x"), post("y")].slice(0, limit),
  } as unknown as BlogRepository,
};

describe("getHomeViewModel", () => {
  it("hero com localização, nome, cargo e os quatro botões na ordem dos públicos", async () => {
    const model = await getHomeViewModel(repositories);
    expect(model.hero).toMatchObject({
      location: site.person.location,
      name: site.person.name,
      role: site.person.role,
      stackLabel: homePage.hero.stackLabel,
    });
    expect(model.hero.actions.map((action) => action.href)).toEqual([
      "/curriculo",
      "/servicos",
      site.links.linkedin.href,
      site.links.github.href,
    ]);
    expect(model.hero.actions.filter((action) => action.external)).toHaveLength(
      2,
    );
  });

  it("cada seção leva à página cheia da sua feature", async () => {
    const model = await getHomeViewModel(repositories);
    expect(model.profile.more.href).toBe("/sobre");
    expect(model.services.all.href).toBe("/servicos");
    expect(model.experience.more.href).toBe("/experiencia");
    expect(model.projects.more.href).toBe("/projetos");
    expect(model.blog.viewAll.href).toBe("/blog");
    expect(model.contact.cta.href).toBe("/contato");
  });

  it("destaques vêm dos repositories, já em texto", async () => {
    const model = await getHomeViewModel(repositories);
    expect(model.projects.cards.map((card) => card.slug)).toEqual(["a", "b"]);
    expect(model.blog.posts.map((card) => card.slug)).toEqual(["x", "y"]);
    expect(model.blog.posts[0]?.href).toBe("/blog/x");
  });

  it("experiência compacta: só os destaques, com link para a página completa", async () => {
    const model = await getHomeViewModel(repositories);
    expect(model.experience.entries.map((entry) => entry.slug)).toEqual([
      "atual",
    ]);
    for (const entry of model.experience.entries) {
      expect(entry.roleHref).toStartWith("/experiencia#");
      expect(entry.groups).toEqual([]);
    }
  });

  it("serviços e stack vêm dos repositories, prontos para os componentes", async () => {
    const model = await getHomeViewModel(repositories);
    expect(model.services.cards[0]).toMatchObject({
      slug: "chatbot",
      href: "/servicos/chatbot",
      title: "Chatbot",
    });
    expect(model.stack.groups[0]?.items[0]?.label).toBe("TypeScript");
    expect(model.profile.model.summary).toBe("Resumo do perfil.");
  });
});
