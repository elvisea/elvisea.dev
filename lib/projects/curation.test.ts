import { describe, expect, it } from "bun:test";

import { projectsConfig } from "@/content/pt-BR/projetos/config";
import snapshotJson from "@/content/pt-BR/projetos/github-snapshot.json";

import { curateProjects, languageCounts, pickFeatured } from "./curation";
import { GithubSnapshotSchema, type GithubRepo } from "./schema";
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
    created_at: "2025-01-01T00:00:00Z",
    pushed_at: "2025-01-01T00:00:00Z",
    ...extra,
  };
}

const base: ProjectsConfig = {
  mode: "all",
  include: [],
  exclude: [],
  hideForks: false,
  hideWithoutDescription: false,
  featured: [],
  overrides: {},
  manual: [],
};

describe("curateProjects", () => {
  const repos = [
    repo("antigo", { pushed_at: "2024-01-01T00:00:00Z" }),
    repo("novo", { pushed_at: "2026-01-01T00:00:00Z" }),
    repo("fork", { fork: true }),
    repo("sem-descricao", { description: null }),
    repo("secreto"),
  ];

  it("aplica exclude e ordena pelo último push", () => {
    const result = curateProjects(repos, { ...base, exclude: ["secreto"] });
    expect(result.map((p) => p.slug)).not.toContain("secreto");
    expect(result[0].slug).toBe("novo");
  });

  it("no modo curated mostra só o include", () => {
    const result = curateProjects(repos, {
      ...base,
      mode: "curated",
      include: ["antigo"],
    });
    expect(result.map((p) => p.slug)).toEqual(["antigo"]);
  });

  it("esconde forks e repositórios sem descrição quando pedido", () => {
    const result = curateProjects(repos, {
      ...base,
      hideForks: true,
      hideWithoutDescription: true,
    });
    const slugs = result.map((p) => p.slug);
    expect(slugs).not.toContain("fork");
    expect(slugs).not.toContain("sem-descricao");
  });

  it("sobrescreve título, resumo e link", () => {
    const [project] = curateProjects([repo("x", { description: null })], {
      ...base,
      overrides: {
        x: { title: "Projeto X", summary: "Resumo", liveUrl: "https://x.dev" },
      },
    });
    expect(project).toMatchObject({
      title: "Projeto X",
      summary: "Resumo",
      liveUrl: "https://x.dev",
    });
  });

  it("põe manuais primeiro e sem link de código", () => {
    const result = curateProjects(repos, {
      ...base,
      manual: [{ slug: "privado", title: "Privado", summary: "S", tags: [] }],
    });
    expect(result[0]).toMatchObject({
      slug: "privado",
      source: "manual",
      repoUrl: null,
    });
  });
});

describe("pickFeatured e languageCounts", () => {
  const projects = curateProjects(
    [
      repo("a", { pushed_at: "2026-03-01T00:00:00Z", language: "Elixir" }),
      repo("b", { pushed_at: "2026-02-01T00:00:00Z" }),
      repo("c", { pushed_at: "2026-01-01T00:00:00Z" }),
    ],
    base,
  );

  it("sem featured, pula projetos sem descrição", () => {
    const mixed = curateProjects(
      [
        repo("sem", { description: null, pushed_at: "2026-05-01T00:00:00Z" }),
        repo("com", { pushed_at: "2026-04-01T00:00:00Z" }),
      ],
      base,
    );
    expect(pickFeatured(mixed, base, 6).map((p) => p.slug)).toEqual(["com"]);
  });

  it("usa a ordem de featured ou os mais recentes", () => {
    expect(pickFeatured(projects, base, 2).map((p) => p.slug)).toEqual([
      "a",
      "b",
    ]);
    expect(
      pickFeatured(projects, { ...base, featured: ["c", "a"] }, 6).map(
        (p) => p.slug,
      ),
    ).toEqual(["c", "a"]);
  });

  it("conta linguagens da mais frequente para a menos", () => {
    expect(languageCounts(projects)).toEqual([
      { language: "TypeScript", count: 2 },
      { language: "Elixir", count: 1 },
    ]);
  });
});

describe("snapshot e configuração reais", () => {
  const snapshot = GithubSnapshotSchema.parse(snapshotJson);
  const names = new Set(snapshot.repos.map((r) => r.name));
  // Tipo amplo: o `as const` do config deixa arrays vazios como `never`.
  const config: ProjectsConfig = projectsConfig;

  it("só tem repositórios públicos", () => {
    expect(snapshot.repos.every((r) => r.private === false)).toBe(true);
  });

  it("todo nome citado na configuração existe no snapshot", () => {
    const manualSlugs = new Set(config.manual.map((m) => m.slug));
    const cited: string[] = [
      ...config.include,
      ...config.exclude,
      ...Object.keys(config.overrides),
    ];
    for (const name of cited) expect(names.has(name)).toBe(true);
    for (const name of config.featured) {
      expect(names.has(name) || manualSlugs.has(name)).toBe(true);
    }
  });

  it("nada da lista de exclusão aparece no resultado", () => {
    const shown = new Set(
      curateProjects(snapshot.repos, projectsConfig).map((p) => p.slug),
    );
    for (const name of projectsConfig.exclude)
      expect(shown.has(name)).toBe(false);
  });
});
