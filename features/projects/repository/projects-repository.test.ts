import { describe, expect, it } from "bun:test";

import snapshotJson from "@/content/pt-BR/projetos/github-snapshot.json";

import {
  createProjectsRepository,
  defaultProjectsRepository,
  loadSnapshot,
} from "./projects-repository";
import type { GithubRepo } from "./schema";
import type { ProjectsConfig } from "./types";

function repo(name: string, extra: Partial<GithubRepo> = {}): GithubRepo {
  return {
    name,
    description: `Descrição de ${name}`,
    html_url: `https://github.com/elvisea/${name}`,
    homepage: null,
    language: "TypeScript",
    topics: [],
    stargazers_count: 0,
    fork: false,
    archived: false,
    private: false,
    created_at: "2024-01-01T00:00:00Z",
    pushed_at: "2025-01-01T00:00:00Z",
    ...extra,
  };
}

const config: ProjectsConfig = {
  mode: "all",
  include: [],
  exclude: ["oculto"],
  hideForks: false,
  hideWithoutDescription: false,
  featured: [],
  overrides: {},
  manual: [
    {
      slug: "caso",
      title: "Estudo de caso",
      summary: "Projeto privado com página própria.",
      tags: [],
      caseStudy: true,
    },
  ],
};

const repository = createProjectsRepository(
  {
    user: "elvisea",
    repos: [
      repo("antigo", { pushed_at: "2024-06-01T00:00:00Z", language: "Elixir" }),
      repo("novo", { pushed_at: "2025-06-01T00:00:00Z" }),
      repo("oculto"),
    ],
  },
  config,
);

describe("createProjectsRepository", () => {
  it("lista manuais primeiro e aplica a curadoria", () => {
    expect(repository.list().map((p) => p.slug)).toEqual([
      "caso",
      "novo",
      "antigo",
    ]);
  });

  it("destaques, linguagens e estudos de caso", () => {
    expect(repository.featured(2).map((p) => p.slug)).toEqual(["caso", "novo"]);
    expect(repository.languages()).toEqual([
      { language: "Elixir", count: 1 },
      { language: "TypeScript", count: 1 },
    ]);
    expect(repository.caseStudies().map((p) => p.slug)).toEqual(["caso"]);
    expect(repository.findCaseStudy("caso")?.title).toBe("Estudo de caso");
    expect(repository.findCaseStudy("novo")).toBeUndefined();
  });
});

describe("loadSnapshot", () => {
  it("aceita o snapshot versionado", () => {
    expect(loadSnapshot(snapshotJson).repos.length).toBeGreaterThan(0);
  });

  it("recusa repositório privado no snapshot", () => {
    expect(() =>
      loadSnapshot({ user: "x", repos: [{ ...repo("p"), private: true }] }),
    ).toThrow();
  });
});

describe("defaultProjectsRepository", () => {
  it("é criado uma vez e reaproveitado", () => {
    expect(defaultProjectsRepository()).toBe(defaultProjectsRepository());
  });
});
