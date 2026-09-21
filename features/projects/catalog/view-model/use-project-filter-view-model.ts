"use client";

/** Estado do filtro por linguagem de `/projetos`. */
import { useMemo, useState } from "react";

import type { ProjectCardModel } from "@/features/projects/domain/project-card";

import {
  ALL_LANGUAGES,
  filterProjectsByLanguage,
  type LanguageOption,
} from "./project-filter";

export function useProjectFilterViewModel(
  cards: readonly ProjectCardModel[],
  options: readonly LanguageOption[],
) {
  const [language, setLanguage] = useState<string>(ALL_LANGUAGES);

  const visible = useMemo(
    () => filterProjectsByLanguage(cards, language),
    [cards, language],
  );

  return {
    language,
    visible,
    resultLabel:
      options.find((option) => option.value === language)?.resultLabel ?? "",
    /** Seleção única e sempre com uma opção ativa: clicar na ativa não desmarca. */
    select: (values: readonly string[]) => {
      if (values[0]) setLanguage(values[0]);
    },
  };
}
