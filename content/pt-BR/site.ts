/**
 * Dados compartilhados pelo shell do site (metadata, header, rodapé, OG).
 *
 * `url` é constante (sem variável de ambiente): sitemap, robots, canonical e
 * imagens OG precisam de URL absoluta estável em build.
 *
 * Regras de conteúdo (ver AGENTS.md): cargo, stack e fatos. Sem slogan, sem
 * telefone, sem salário.
 */
export const site = {
  url: "https://elvisea.dev",
  domain: "elvisea.dev",
  locale: "pt_BR",
  person: {
    name: "Elvis Amancio",
    fullName: "Elvis Erison Amancio",
    role: "Desenvolvedor Full-Stack Sênior",
    stack: ["TypeScript", "NestJS", "Next.js", "PostgreSQL", "Elixir"],
    location: "Curitiba, Paraná, Brasil",
  },
  description:
    "Elvis Amancio, desenvolvedor full-stack sênior. TypeScript, NestJS, Next.js, PostgreSQL e Elixir. Experiência profissional, projetos e artigos.",
  links: {
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/elvisea/",
    },
    github: {
      label: "GitHub",
      href: "https://github.com/elvisea",
    },
  },
  navigation: [
    { href: "/", label: "Início" },
    { href: "/experiencia", label: "Experiência" },
    { href: "/projetos", label: "Projetos" },
    { href: "/sobre", label: "Sobre" },
    { href: "/blog", label: "Blog" },
  ],
  /** Links extras do rodapé (fora do menu principal). */
  footerLinks: [
    { href: "/como-trabalho", label: "Como trabalho" },
    { href: "/curriculo", label: "Currículo" },
  ],
  a11y: {
    skipToContent: "Pular para o conteúdo",
    homeLink: "Elvis Amancio — página inicial",
    mainNav: "Navegação principal",
    mobileNav: "Navegação (mobile)",
    openMenu: "Abrir menu",
    footerNav: "Links do rodapé",
  },
  header: {
    sheetDescription: "Páginas do site.",
  },
  footer: {
    copyright: "Elvis Erison Amancio",
  },
  theme: {
    toggleLightAria: "Ativar tema claro",
    toggleDarkAria: "Ativar tema escuro",
  },
  notFound: {
    title: "Página não encontrada",
    description: "O endereço acessado não existe ou foi movido.",
    backHome: "Voltar para o início",
  },
} as const;

export type NavItem = (typeof site.navigation)[number];
