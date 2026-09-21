/**
 * View-model do estudo de caso (`/projetos/<slug>`): o texto vem de
 * `content/pt-BR/projetos/casos/<slug>.md`. `null` para slug que não é
 * estudo de caso (a rota responde 404).
 */
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import {
  defaultProjectsRepository,
  type ProjectsRepository,
} from "@/features/projects/repository/projects-repository";
import { PROJECTS_PATH, projectPath } from "@/features/projects/routes";
import { renderContentPage } from "@/lib/content/markdown-page";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface CaseStudyMetadata {
  title: string;
  description: string | undefined;
  path: string;
}

export interface CaseStudyViewModel {
  back: { href: string; label: string };
  header: { eyebrow: string; title: string; description?: string };
  /** HTML do Markdown, já renderizado em build. */
  html: string;
  breadcrumb: readonly BreadcrumbItem[];
  metadata: CaseStudyMetadata;
}

export function getCaseStudySlugs(
  repository: ProjectsRepository = defaultProjectsRepository(),
): string[] {
  return repository.caseStudies().map((project) => project.slug);
}

export function getCaseStudyMetadata(
  slug: string,
  repository: ProjectsRepository = defaultProjectsRepository(),
): CaseStudyMetadata | null {
  const project = repository.findCaseStudy(slug);
  if (!project) return null;
  return {
    title: project.title,
    description: project.summary ?? undefined,
    path: projectPath(project.slug),
  };
}

export async function getCaseStudyViewModel(
  slug: string,
  {
    repository = defaultProjectsRepository(),
    renderPage = renderContentPage,
  }: {
    repository?: ProjectsRepository;
    renderPage?: (name: string) => Promise<string>;
  } = {},
): Promise<CaseStudyViewModel | null> {
  const project = repository.findCaseStudy(slug);
  if (!project) return null;

  return {
    back: { href: PROJECTS_PATH, label: projetosPage.caseStudy.back },
    header: {
      eyebrow: projetosPage.header.eyebrow,
      title: project.title,
      description: project.summary ?? undefined,
    },
    html: await renderPage(`projetos/casos/${project.slug}`),
    breadcrumb: [
      { name: projetosPage.metaTitle, path: PROJECTS_PATH },
      { name: project.title, path: projectPath(project.slug) },
    ],
    metadata: {
      title: project.title,
      description: project.summary ?? undefined,
      path: projectPath(project.slug),
    },
  };
}
