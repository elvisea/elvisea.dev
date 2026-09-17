import Link from "next/link";

import { ArrowUpRightIcon, StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { formatYearMonth, toYearMonth } from "@/lib/content/dates";
import type { Project } from "@/lib/projects/types";
import { cn } from "cn";

const linkClass = cn(
  buttonVariants({ variant: "link", size: "sm" }),
  "h-11 px-0 sm:h-7",
);

export function ProjectCard({ project }: { project: Project }) {
  const { card } = projetosPage;
  const updated = project.updatedAt
    ? formatYearMonth(toYearMonth(new Date(project.updatedAt)))
    : null;

  return (
    <Card className="h-full transition-shadow hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="font-mono font-semibold break-all text-heading">
          <h3>{project.title}</h3>
        </CardTitle>
        {project.fork ? (
          <CardAction>
            <Badge className="font-mono" variant="outline">
              {card.fork}
            </Badge>
          </CardAction>
        ) : null}
        <CardDescription
          className={cn(
            "text-pretty",
            project.summary ? "text-foreground" : "italic",
          )}
        >
          {project.summary ?? card.noDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
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
      </CardContent>

      <CardFooter className="flex-wrap gap-x-4 gap-y-1 py-2">
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
            <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
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
            <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
