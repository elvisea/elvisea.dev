"use client";

/**
 * Lista de projetos com filtro por linguagem. Os dados chegam prontos do
 * servidor (estáticos); o filtro só troca o que é exibido, sem nova busca.
 */
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/molecules/project-card";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import type { Project } from "@/lib/projects/types";
import { cn } from "cn";

interface ProjectExplorerProps {
  projects: readonly Project[];
  languages: readonly { language: string; count: number }[];
}

export function ProjectExplorer({ projects, languages }: ProjectExplorerProps) {
  const [language, setLanguage] = useState<string | null>(null);
  const { filter } = projetosPage;

  const visible = useMemo(
    () =>
      language ? projects.filter((p) => p.language === language) : projects,
    [projects, language],
  );

  const options = [
    { value: null, label: filter.all, count: projects.length },
    ...languages.map((l) => ({
      value: l.language,
      label: l.language,
      count: l.count,
    })),
  ];

  return (
    <div className="space-y-8">
      <div
        aria-label={filter.label}
        className="flex flex-wrap gap-2"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === language;
          return (
            <button
              key={option.label}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              )}
              type="button"
              onClick={() => setLanguage(option.value)}
            >
              {option.label}
              <span
                className={cn(
                  "font-mono text-xs",
                  active ? "opacity-80" : "text-muted-foreground",
                )}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="font-mono text-sm text-muted-foreground">
        {filter.count(visible.length)}
      </p>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
