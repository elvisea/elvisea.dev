/**
 * Textos de interface das páginas profissionais: home, `/experiencia`,
 * `/sobre`, `/como-trabalho` e `/curriculo`. O conteúdo em si (experiências,
 * perfil, stack…) vive nos arquivos de dados de `content/pt-BR/`.
 */
export const homePage = {
  hero: {
    stackLabel: "Stack principal",
    resume: "Currículo",
  },
  profile: {
    eyebrow: "Perfil",
    title: "Perfil profissional",
    more: "Mais sobre mim",
  },
  experience: {
    eyebrow: "Experiência",
    title: "Experiência recente",
    all: "Ver toda a experiência",
  },
  stack: {
    eyebrow: "Stack",
    title: "Tecnologias",
  },
} as const;

export const experienciaPage = {
  metaTitle: "Experiência",
  metaDescription:
    "Experiência profissional de Elvis Amancio: ATZ AERO, Trio, MAG Finanças (via SH Squads), Contabilizei, b2k, SPRO, ztrax e MobileSys.",
  header: {
    eyebrow: "Experiência",
    title: "Experiência profissional",
    description:
      "Empresas, períodos e o que foi feito em cada uma, da mais recente para a mais antiga.",
  },
  labels: {
    current: "atual",
    stack: "Tecnologias usadas",
    companyPage: "Página da empresa no LinkedIn",
  },
  modes: {
    remoto: "Remoto",
    híbrido: "Híbrido",
    presencial: "Presencial",
  },
} as const;

export const sobrePage = {
  metaTitle: "Sobre",
  metaDescription:
    "Perfil profissional, stack, formação e certificados de Elvis Amancio, desenvolvedor full-stack sênior.",
  header: {
    eyebrow: "Sobre",
    title: "Perfil profissional",
  },
  atuacao: "Atuação",
  engenhariaComIa: {
    title: "Engenharia com IA",
    link: "Como trabalho",
  },
  stack: {
    eyebrow: "Stack",
    title: "Tecnologias",
  },
  formacao: {
    eyebrow: "Formação",
    title: "Formação acadêmica",
  },
  certificados: {
    eyebrow: "Certificados",
    title: "Cursos e certificados",
    noDate: "sem data",
    view: "Ver certificado",
  },
  curriculo: "Ver currículo",
} as const;

export const comoTrabalhoPage = {
  metaTitle: "Como trabalho",
  metaDescription:
    "Fluxo de desenvolvimento de Elvis Amancio: agentes de IA com contexto por repositório, quality gates no CI, infraestrutura e entrega.",
  header: {
    eyebrow: "Como trabalho",
    title: "Fluxo de desenvolvimento",
    description:
      "Agentes de IA, revisão, quality gates, infraestrutura e entrega.",
  },
} as const;

export const curriculoPage = {
  metaTitle: "Currículo",
  metaDescription:
    "Currículo de Elvis Amancio em PDF, em duas versões: produto (full-stack e backend) e infraestrutura (DevOps e SRE).",
  header: {
    eyebrow: "Currículo",
    title: "Currículo em PDF",
    description:
      "Duas versões com os mesmos fatos e ênfases diferentes. Ambas com uma página.",
  },
  files: [
    {
      title: "Produto",
      description:
        "Para vagas de full-stack e backend. Começa pela API, pelo frontend e pelo produto.",
      href: "/curriculo/elvis-erison-amancio-curriculo-produto.pdf",
    },
    {
      title: "Infraestrutura",
      description:
        "Para vagas de DevOps, SRE e infraestrutura. Começa por Ansible, rede, incidentes e CI.",
      href: "/curriculo/elvis-erison-amancio-curriculo-infraestrutura.pdf",
    },
  ],
  download: "Abrir PDF",
} as const;
