/**
 * Fachada dos projetos. O snapshot entra por `import` (sem leitura de arquivo
 * em runtime) e é validado ao carregar: dado inválido falha o build.
 */
import { projectsConfig } from "@/content/pt-BR/projetos/config";
import snapshotJson from "@/content/pt-BR/projetos/github-snapshot.json";

import { curateProjects, languageCounts, pickFeatured } from "./curation";
import { GithubSnapshotSchema } from "./schema";
import type { Project } from "./types";

const snapshot = GithubSnapshotSchema.parse(snapshotJson);
const projects = curateProjects(snapshot.repos, projectsConfig);

export function getProjects(): readonly Project[] {
  return projects;
}

export function getFeaturedProjects(limit = 6): Project[] {
  return pickFeatured(projects, projectsConfig, limit);
}

export function getProjectLanguages() {
  return languageCounts(projects);
}

export function getCaseStudies(): Project[] {
  return projects.filter((p) => p.caseStudy);
}

export type { Project } from "./types";
