import type { YearMonth } from "@/lib/content/types";

/** Projeto pronto para exibição (vindo do GitHub ou escrito à mão). */
export interface Project {
  slug: string;
  source: "github" | "manual";
  title: string;
  summary: string | null;
  language: string | null;
  tags: readonly string[];
  /** `null` em projetos privados (estudos de caso sem código público). */
  repoUrl: string | null;
  liveUrl: string | null;
  stars: number;
  fork: boolean;
  /** ISO 8601 do último push (GitHub) ou `null`. */
  updatedAt: string | null;
  /** Tem página própria em `/projetos/[slug]`. */
  caseStudy: boolean;
}

/** Estudo de caso de projeto sem código público. */
export interface ManualProject {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  period?: { start: YearMonth; end: YearMonth | null };
  liveUrl?: string;
  /** Existe `content/pt-BR/projetos/casos/<slug>.md` com o texto completo. */
  caseStudy?: boolean;
}

export interface ProjectOverride {
  title?: string;
  summary?: string;
  tags?: readonly string[];
  liveUrl?: string | null;
}

export interface ProjectsConfig {
  /**
   * `all`: todos os repositórios públicos, menos `exclude`.
   * `curated`: só os de `include`.
   */
  mode: "all" | "curated";
  include: readonly string[];
  exclude: readonly string[];
  hideForks: boolean;
  hideWithoutDescription: boolean;
  /** Nomes (repo ou slug manual) em destaque na home, na ordem da tela. Vazio = mais recentes. */
  featured: readonly string[];
  overrides: Readonly<Record<string, ProjectOverride>>;
  manual: readonly ManualProject[];
}
