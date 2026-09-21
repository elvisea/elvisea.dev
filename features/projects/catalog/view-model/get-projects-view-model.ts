/**
 * View-model de `/projetos`: cabeçalho, opções do filtro por linguagem, cards
 * prontos para exibir, trilha e metadata.
 */
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import {
  type ProjectCardModel,
  toProjectCardModel,
} from "@/features/projects/domain/project-card";
import {
  defaultProjectsRepository,
  type ProjectsRepository,
} from "@/features/projects/repository/projects-repository";
import { PROJECTS_PATH } from "@/features/projects/routes";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

import { buildLanguageOptions, type LanguageOption } from "./project-filter";

export interface ProjectsViewModel {
  header: typeof projetosPage.header;
  filter: { label: string; options: readonly LanguageOption[] };
  cards: readonly ProjectCardModel[];
  breadcrumb: readonly BreadcrumbItem[];
  metadata: { title: string; description: string; path: string };
}

export function getProjectsViewModel(
  repository: ProjectsRepository = defaultProjectsRepository(),
): ProjectsViewModel {
  const projects = repository.list();
  return {
    header: projetosPage.header,
    filter: {
      label: projetosPage.filter.label,
      options: buildLanguageOptions(
        projects.length,
        repository.languages(),
        projetosPage.filter,
      ),
    },
    cards: projects.map((project) =>
      toProjectCardModel(project, projetosPage.card),
    ),
    breadcrumb: [{ name: projetosPage.metaTitle, path: PROJECTS_PATH }],
    metadata: {
      title: projetosPage.metaTitle,
      description: projetosPage.metaDescription,
      path: PROJECTS_PATH,
    },
  };
}
