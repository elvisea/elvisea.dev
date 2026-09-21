"use client";

/**
 * Lista de projetos com filtro por linguagem (ToggleGroup de seleção única).
 * Os cards chegam prontos do servidor; o estado do filtro fica no view-model.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { LanguageOption } from "@/features/projects/catalog/view-model/project-filter";
import { useProjectFilterViewModel } from "@/features/projects/catalog/view-model/use-project-filter-view-model";
import { ProjectCard } from "@/features/projects/components/molecules/project-card";
import type { ProjectCardModel } from "@/features/projects/domain/project-card";

interface ProjectExplorerProps {
  cards: readonly ProjectCardModel[];
  filter: { label: string; options: readonly LanguageOption[] };
}

export function ProjectExplorer({ cards, filter }: ProjectExplorerProps) {
  const { language, visible, resultLabel, select } = useProjectFilterViewModel(
    cards,
    filter.options,
  );

  return (
    <div className="space-y-8">
      <ToggleGroup
        aria-label={filter.label}
        className="w-full flex-wrap"
        value={[language]}
        variant="outline"
        onValueChange={select}
      >
        {filter.options.map((option) => (
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
        {resultLabel}
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
