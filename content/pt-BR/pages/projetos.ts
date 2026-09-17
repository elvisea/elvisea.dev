/** Textos de interface de `/projetos`, do card de projeto e da prévia na home. */
export const projetosPage = {
  metaTitle: "Projetos",
  metaDescription:
    "Repositórios públicos de Elvis Amancio no GitHub: projetos, estudos e experimentos em TypeScript, Elixir, React Native e outras tecnologias.",
  header: {
    eyebrow: "Projetos",
    title: "Projetos e repositórios",
    description:
      "Repositórios públicos do GitHub, do mais recente para o mais antigo. Parte do trabalho profissional é privado e não aparece aqui.",
  },
  filter: {
    label: "Filtrar por linguagem",
    all: "Todas",
    count: (n: number) => (n === 1 ? "1 projeto" : `${n} projetos`),
  },
  card: {
    noDescription: "Sem descrição no GitHub.",
    code: "Código",
    site: "Site",
    caseStudy: "Estudo de caso",
    updated: "atualizado em",
    fork: "fork",
    stars: (n: number) => (n === 1 ? "1 estrela" : `${n} estrelas`),
  },
  preview: {
    eyebrow: "Projetos",
    title: "Projetos recentes",
    all: "Ver todos os projetos",
  },
  caseStudy: {
    back: "Voltar para projetos",
  },
} as const;
