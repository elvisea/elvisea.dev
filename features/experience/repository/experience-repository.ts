/** Porta de acesso às experiências profissionais (`content/pt-BR/experiencias.ts`). */
import { experiencias } from "@/content/pt-BR/experiencias";
import type { Experience } from "@/lib/content/types";

export interface ExperienceRepository {
  /** Todas, da mais recente para a mais antiga (ordem do conteúdo). */
  list(): readonly Experience[];
  /** As marcadas com `highlight`, mostradas na home. */
  highlighted(): readonly Experience[];
  findBySlug(slug: string): Experience | undefined;
}

export function createExperienceRepository(
  source: readonly Experience[],
): ExperienceRepository {
  return {
    list: () => source,
    highlighted: () =>
      source.filter((item) => "highlight" in item && item.highlight === true),
    findBySlug: (slug) => source.find((item) => item.slug === slug),
  };
}

export const experienceRepository = createExperienceRepository(experiencias);
