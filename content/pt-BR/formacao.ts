/** Formação acadêmica. Fonte: `info_linkedin/knowledge-base/education/`. */
import type { Education } from "@/lib/content/types";

export const formacao = [
  {
    institution: "UNINTER Centro Universitário Internacional",
    degree: "Tecnólogo",
    field: "Análise e Desenvolvimento de Sistemas",
    startYear: null,
    endYear: null,
  },
  {
    institution: "Rocketseat",
    degree: "Bootcamp",
    field: "Programação",
    startYear: 2020,
    endYear: 2021,
  },
] as const satisfies readonly Education[];
