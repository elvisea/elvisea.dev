/** Filtro de projetos por linguagem (funções puras do catálogo). */
import type { ProjectCardModel } from "@/features/projects/domain/project-card";

/** Valor da opção "Todas". */
export const ALL_LANGUAGES = "__todas__";

export interface LanguageOption {
  value: string;
  label: string;
  count: number;
  /** Texto do contador de resultados quando esta opção está ativa. */
  resultLabel: string;
}

/** "Todas" primeiro, depois as linguagens na ordem recebida. */
export function buildLanguageOptions(
  total: number,
  languages: readonly { language: string; count: number }[],
  texts: { all: string; count: (n: number) => string },
): LanguageOption[] {
  return [
    {
      value: ALL_LANGUAGES,
      label: texts.all,
      count: total,
      resultLabel: texts.count(total),
    },
    ...languages.map(({ language, count }) => ({
      value: language,
      label: language,
      count,
      resultLabel: texts.count(count),
    })),
  ];
}

export function filterProjectsByLanguage(
  cards: readonly ProjectCardModel[],
  language: string,
): readonly ProjectCardModel[] {
  return language === ALL_LANGUAGES
    ? cards
    : cards.filter((card) => card.language === language);
}
