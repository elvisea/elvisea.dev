/**
 * Porta de acesso aos projetos: snapshot do GitHub validado mais a
 * curadoria de `content/pt-BR/projetos/config.ts`.
 *
 * O snapshot entra por `import` (sem leitura de arquivo em runtime) e é
 * validado por `loadSnapshot` só quando o repository padrão é usado pela
 * primeira vez, não no import do módulo. Dado inválido falha o build.
 */
import { projectsConfig } from "@/content/pt-BR/projetos/config";
import snapshotJson from "@/content/pt-BR/projetos/github-snapshot.json";

import { curateProjects, languageCounts, pickFeatured } from "./curation";
import { type GithubSnapshot, GithubSnapshotSchema } from "./schema";
import type { Project, ProjectsConfig } from "./types";

export interface ProjectsRepository {
  /** Todos os projetos exibidos: manuais primeiro, depois GitHub por último push. */
  list(): readonly Project[];
  /** Destaques da home. */
  featured(limit: number): Project[];
  /** Linguagens presentes, da mais frequente para a menos. */
  languages(): { language: string; count: number }[];
  /** Projetos com página própria (`/projetos/<slug>`). */
  caseStudies(): Project[];
  findCaseStudy(slug: string): Project | undefined;
}

/** Valida o snapshot gravado por `bun run sync:github`. */
export function loadSnapshot(json: unknown): GithubSnapshot {
  return GithubSnapshotSchema.parse(json);
}

export function createProjectsRepository(
  snapshot: GithubSnapshot,
  config: ProjectsConfig,
): ProjectsRepository {
  const projects = curateProjects(snapshot.repos, config);
  const caseStudies = () => projects.filter((project) => project.caseStudy);
  return {
    list: () => projects,
    featured: (limit) => pickFeatured(projects, config, limit),
    languages: () => languageCounts(projects),
    caseStudies,
    findCaseStudy: (slug) =>
      caseStudies().find((project) => project.slug === slug),
  };
}

let instance: ProjectsRepository | undefined;

/** Repository com o snapshot e a curadoria reais, criado no primeiro uso. */
export function defaultProjectsRepository(): ProjectsRepository {
  instance ??= createProjectsRepository(
    loadSnapshot(snapshotJson),
    projectsConfig,
  );
  return instance;
}
