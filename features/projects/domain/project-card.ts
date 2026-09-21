/**
 * Modelo do card de projeto, usado em `/projetos` e na home. Tudo já em
 * texto: o card só exibe (datas formatadas, rótulos com plural resolvido).
 */
import type { Project } from "@/features/projects/repository/types";
import { projectPath } from "@/features/projects/routes";
import { formatYearMonth, toYearMonth } from "@/lib/content/dates";

/** Textos do card, como em `content/pt-BR/pages/projetos.ts`. */
export interface ProjectCardTexts {
  noDescription: string;
  code: string;
  site: string;
  caseStudy: string;
  updated: string;
  fork: string;
  stars: (count: number) => string;
}

export interface ProjectCardLink {
  href: string;
  label: string;
  /** Nome acessível com o título do projeto (links repetidos em cada card). */
  ariaLabel: string;
}

export interface ProjectCardModel {
  slug: string;
  title: string;
  /** Resumo ou, sem ele, o aviso de "sem descrição" (em itálico). */
  summary: string;
  hasSummary: boolean;
  language: string | null;
  /** Rótulo do fork, ou `null` quando não é fork. */
  fork: string | null;
  stars: { count: number; label: string } | null;
  /** Rótulo e mês/ano da última atualização, ou `null` sem data. Separados
   * porque o card os renderiza como dois nós de texto. */
  updated: { label: string; value: string } | null;
  caseStudy: { href: string; label: string } | null;
  repo: ProjectCardLink | null;
  site: ProjectCardLink | null;
}

export function toProjectCardModel(
  project: Project,
  texts: ProjectCardTexts,
): ProjectCardModel {
  const link = (href: string | null, label: string) =>
    href ? { href, label, ariaLabel: `${label}: ${project.title}` } : null;

  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary ?? texts.noDescription,
    hasSummary: project.summary !== null,
    language: project.language,
    fork: project.fork ? texts.fork : null,
    stars:
      project.stars > 0
        ? { count: project.stars, label: texts.stars(project.stars) }
        : null,
    updated: project.updatedAt
      ? {
          label: texts.updated,
          value: formatYearMonth(toYearMonth(new Date(project.updatedAt))),
        }
      : null,
    caseStudy: project.caseStudy
      ? { href: projectPath(project.slug), label: texts.caseStudy }
      : null,
    repo: link(project.repoUrl, texts.code),
    site: link(project.liveUrl, texts.site),
  };
}
