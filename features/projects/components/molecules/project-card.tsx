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
import type { ProjectCardModel } from "@/features/projects/domain/project-card";
import { cn } from "cn";

const linkClass = cn(
  buttonVariants({ variant: "link", size: "sm" }),
  "h-11 px-0 sm:h-7",
);

/** Card de um projeto: nome, resumo, linguagem, estrelas, data e links. */
export function ProjectCard({ project }: { project: ProjectCardModel }) {
  return (
    <Card className="h-full transition-shadow hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="font-mono font-semibold break-all text-heading">
          <h3>{project.title}</h3>
        </CardTitle>
        {project.fork ? (
          <CardAction>
            <Badge className="font-mono" variant="outline">
              {project.fork}
            </Badge>
          </CardAction>
        ) : null}
        <CardDescription
          className={cn(
            "text-pretty",
            project.hasSummary ? "text-foreground" : "italic",
          )}
        >
          {project.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
          {project.language ? <span>{project.language}</span> : null}
          {project.stars ? (
            <span className="inline-flex items-center gap-1">
              <StarIcon aria-hidden className="size-3" />
              <span className="sr-only">{project.stars.label}</span>
              <span aria-hidden>{project.stars.count}</span>
            </span>
          ) : null}
          {project.updated ? (
            <span>
              {project.updated.label} {project.updated.value}
            </span>
          ) : null}
        </p>
      </CardContent>

      <CardFooter className="flex-wrap gap-x-4 gap-y-1 py-2">
        {project.caseStudy ? (
          <Link className={linkClass} href={project.caseStudy.href}>
            {project.caseStudy.label}
          </Link>
        ) : null}
        {[project.repo, project.site].map((link) =>
          link ? (
            <a
              key={link.href}
              aria-label={link.ariaLabel}
              className={linkClass}
              href={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
              <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
            </a>
          ) : null,
        )}
      </CardFooter>
    </Card>
  );
}
