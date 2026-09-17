"use client";

/**
 * Lista de projetos com filtro por linguagem (ToggleGroup de seleção única).
 * Os dados chegam prontos do servidor; o filtro só troca o que é exibido.
 */
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/molecules/project-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import type { Project } from "@/lib/projects/types";

const ALL = "__todas__";

interface ProjectExplorerProps {
  projects: readonly Project[];
  languages: readonly { language: string; count: number }[];
}

export function ProjectExplorer({ projects, languages }: ProjectExplorerProps) {
  const [language, setLanguage] = useState<string>(ALL);
  const { filter } = projetosPage;

  const visible = useMemo(
    () =>
      language === ALL
        ? projects
        : projects.filter((p) => p.language === language),
    [projects, language],
  );

  const options = [
    { value: ALL, label: filter.all, count: projects.length },
    ...languages.map((l) => ({
      value: l.language,
      label: l.language,
      count: l.count,
    })),
  ];

  return (
    <div className="space-y-8">
      <ToggleGroup
        aria-label={filter.label}
        className="w-full flex-wrap"
        value={[language]}
        variant="outline"
        onValueChange={(value) => {
          // Seleção única e sempre com uma opção ativa: clicar na ativa não desmarca.
          if (value[0]) setLanguage(value[0]);
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            className="h-10 gap-2 rounded-full px-3.5 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            value={option.value}
          >
            {option.label}
            <span className="font-mono text-xs opacity-70">{option.count}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

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
