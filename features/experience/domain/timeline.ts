/**
 * Entrada da linha do tempo já em texto: período, local, parágrafos e badges.
 *
 * - `compact` (home): só a abertura do resumo, com o cargo levando à página
 *   completa;
 * - `full` (`/experiencia`): todos os parágrafos, os blocos de bullets e a
 *   âncora de cada item.
 */
import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import {
  toStackBadges,
  type StackBadgeModel,
} from "@/features/about/domain/stack-badges";
import { experienceAnchor } from "@/features/experience/routes";
import { formatPeriod } from "@/lib/content/dates";
import type { Experience, StackItem } from "@/lib/content/types";

export interface TimelineTexts {
  stack: string;
  companyPage: string;
  modes: Record<string, string>;
}

export interface TimelineGroup {
  title: string | null;
  bullets: readonly string[];
}

export interface TimelineEntry {
  slug: string;
  /** Só no modo completo: id da âncora. */
  anchor: string | null;
  /** Experiência em andamento (ponto destacado na linha). */
  current: boolean;
  period: string;
  role: string;
  /** Link para a experiência completa; `null` no modo completo. */
  roleHref: string | null;
  company: { name: string; href?: string; ariaLabel?: string };
  engagement?: string;
  /** Local e modalidade ("Curitiba · Remoto"), ou `null`. */
  place: string | null;
  paragraphs: readonly string[];
  groups: readonly TimelineGroup[];
  stack: { label: string; badges: readonly StackBadgeModel[] };
}

export function toTimelineEntry(
  experience: Experience,
  texts: TimelineTexts,
  options: { full: boolean; stackItem: (key: string) => StackItem | undefined },
): TimelineEntry {
  const { full, stackItem } = options;
  const place =
    [experience.location, texts.modes[experience.mode]]
      .filter(Boolean)
      .join(" · ") || null;

  return {
    slug: experience.slug,
    anchor: full ? experience.slug : null,
    current: experience.end === null,
    period: formatPeriod(experience.start, experience.end),
    role: experience.role,
    roleHref: full ? null : experienceAnchor(experience.slug),
    company: {
      name: experience.company,
      href: experience.companyUrl,
      ariaLabel: experience.companyUrl
        ? `${experience.company} — ${texts.companyPage}`
        : undefined,
    },
    engagement: experience.engagement,
    place,
    paragraphs: full ? experience.summary : experience.summary.slice(0, 1),
    groups: full
      ? experience.groups.map((group) => ({
          title: group.title ?? null,
          bullets: group.bullets,
        }))
      : [],
    stack: {
      label: `${texts.stack} na ${experience.company}`,
      badges: toStackBadges(experience.stack, stackItem),
    },
  };
}

/** Textos da linha do tempo (`content/pt-BR/pages/profissional.ts`). */
export const timelineTexts: TimelineTexts = {
  stack: experienciaPage.labels.stack,
  companyPage: experienciaPage.labels.companyPage,
  modes: experienciaPage.modes,
};

/** Entradas da linha do tempo; `full: false` é a versão compacta da home. */
export function toTimelineEntries(
  experiences: readonly Experience[],
  options: { full: boolean; stackItem: (key: string) => StackItem | undefined },
): TimelineEntry[] {
  return experiences.map((experience) =>
    toTimelineEntry(experience, timelineTexts, options),
  );
}
