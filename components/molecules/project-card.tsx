import Link from "next/link";

import { ArrowUpRightIcon, StarIcon } from "lucide-react";

import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { formatYearMonth, toYearMonth } from "@/lib/content/dates";
import type { Project } from "@/lib/projects/types";

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline sm:min-h-0";

export function ProjectCard({ project }: { project: Project }) {
  const { card } = projetosPage;
  const updated = project.updatedAt
    ? formatYearMonth(toYearMonth(new Date(project.updatedAt)))
    : null;

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <header className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-base font-semibold break-all text-heading">
          {project.title}
        </h3>
        {project.fork ? (
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {card.fork}
          </span>
        ) : null}
      </header>

      <p
        className={
          project.summary
            ? "text-sm text-pretty text-foreground"
            : "text-sm text-muted-foreground italic"
        }
      >
        {project.summary ?? card.noDescription}
      </p>

      <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
        {project.language ? <span>{project.language}</span> : null}
        {project.stars > 0 ? (
          <span className="inline-flex items-center gap-1">
            <StarIcon aria-hidden className="size-3" />
            <span className="sr-only">{card.stars(project.stars)}</span>
            <span aria-hidden>{project.stars}</span>
          </span>
        ) : null}
        {updated ? (
          <span>
            {card.updated} {updated}
          </span>
        ) : null}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {project.caseStudy ? (
          <Link className={linkClass} href={`/projetos/${project.slug}`}>
            {card.caseStudy}
          </Link>
        ) : null}
        {project.repoUrl ? (
          <a
            aria-label={`${card.code}: ${project.title}`}
            className={linkClass}
            href={project.repoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {card.code}
            <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            aria-label={`${card.site}: ${project.title}`}
            className={linkClass}
            href={project.liveUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {card.site}
            <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
