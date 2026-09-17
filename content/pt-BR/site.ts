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
  /** Open Graph (`pt_BR`). */
  locale: "pt_BR",
  /** `lang` do HTML e `inLanguage` dos dados estruturados. */
  language: "pt-BR",
  person: {
    name: "Elvis Amancio",
    fullName: "Elvis Erison Amancio",
    role: "Desenvolvedor Full-Stack Sênior",
    stack: ["TypeScript", "NestJS", "Next.js", "PostgreSQL", "Elixir"],
    location: "Curitiba, Paraná, Brasil",
  },
  description:
    "Elvis Amancio, desenvolvedor full-stack sênior em Curitiba, atendimento remoto em todo o Brasil. Sistemas web, APIs, aplicativos, automação e chatbots com IA.",
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
  seo: {
    /** Primeiro item de toda trilha (`BreadcrumbList`). */
    breadcrumbHome: "Início",
    /** Perfis que identificam a pessoa nos dados estruturados (`sameAs`), fora da interface. */
    otherProfiles: ["https://www.youtube.com/@elviseamancio"],
  },
  // Sem "Início": o nome no cabeçalho já leva à home.
  navigation: [
    { href: "/experiencia", label: "Experiência" },
    { href: "/servicos", label: "Serviços" },
    { href: "/projetos", label: "Projetos" },
    { href: "/sobre", label: "Sobre" },
    { href: "/blog", label: "Blog" },
    { href: "/contato", label: "Contato" },
  ],
  /** Links extras do rodapé (fora do menu principal). */
  footerLinks: [
    { href: "/como-trabalho", label: "Como trabalho" },
    { href: "/curriculo", label: "Currículo" },
    { href: "/rss.xml", label: "RSS" },
  ],
  a11y: {
    skipToContent: "Pular para o conteúdo",
    homeLinkHint: "página inicial",
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
    toggleAria: "Alternar tema",
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
