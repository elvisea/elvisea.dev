/**
 * Regras de curadoria (funções puras, testadas em `curation.test.ts`).
 */
import type { GithubRepo } from "./schema";
import type { ManualProject, Project, ProjectsConfig } from "./types";

function fromGithub(repo: GithubRepo, config: ProjectsConfig): Project {
  const override = config.overrides[repo.name] ?? {};
  const homepage = repo.homepage?.trim() ? repo.homepage.trim() : null;
  return {
    slug: repo.name,
    source: "github",
    title: override.title ?? repo.name,
    summary: override.summary ?? (repo.description?.trim() || null),
    language: repo.language,
    tags: override.tags ?? repo.topics,
    repoUrl: repo.html_url,
    liveUrl: override.liveUrl !== undefined ? override.liveUrl : homepage,
    stars: repo.stargazers_count,
    fork: repo.fork,
    updatedAt: repo.pushed_at,
    caseStudy: false,
  };
}

function fromManual(project: ManualProject): Project {
  return {
    slug: project.slug,
    source: "manual",
    title: project.title,
    summary: project.summary,
    language: null,
    tags: project.tags,
    repoUrl: null,
    liveUrl: project.liveUrl ?? null,
    stars: 0,
    fork: false,
    updatedAt: null,
    caseStudy: project.caseStudy === true,
  };
}

/**
 * Aplica a configuração ao snapshot: filtra, sobrescreve textos e soma os
 * projetos manuais. Ordem: manuais primeiro, depois GitHub por último push.
 */
export function curateProjects(
  repos: readonly GithubRepo[],
  config: ProjectsConfig,
): Project[] {
  const exclude = new Set(config.exclude);
  const include = new Set(config.include);

  const github = repos
    .filter((repo) => !exclude.has(repo.name))
    .filter((repo) => config.mode === "all" || include.has(repo.name))
    .filter((repo) => !(config.hideForks && repo.fork))
    .map((repo) => fromGithub(repo, config))
    .filter((p) => !(config.hideWithoutDescription && !p.summary))
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));

  return [...config.manual.map(fromManual), ...github];
}

/**
 * Destaques da home: `featured` na ordem dada ou, se vazio, os mais recentes
 * que têm descrição (card sem texto não serve de vitrine).
 */
export function pickFeatured(
  projects: readonly Project[],
  config: ProjectsConfig,
  limit: number,
): Project[] {
  if (config.featured.length === 0) {
    return projects.filter((p) => p.summary).slice(0, limit);
  }
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return config.featured
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Project => p !== undefined)
    .slice(0, limit);
}

/** Linguagens presentes, da mais frequente para a menos. */
export function languageCounts(
  projects: readonly Project[],
): { language: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    if (p.language) counts.set(p.language, (counts.get(p.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}
