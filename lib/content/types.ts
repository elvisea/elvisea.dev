/**
 * Tipos do conteúdo profissional (`content/pt-BR/*.ts`).
 *
 * O conteúdo é escrito em TypeScript com `satisfies`, então o compilador já
 * valida a forma. Invariantes que o tipo não expressa (datas coerentes, slugs
 * únicos, chaves de stack existentes) ficam em `content.test.ts`.
 */

/** Mês no formato `YYYY-MM`. */
export type YearMonth = `${number}-${number}`;

export type WorkMode = "remoto" | "híbrido" | "presencial";

export interface ExperienceGroup {
  /** Título do bloco (ex.: "Infraestrutura"); `null` para lista sem título. */
  title: string | null;
  bullets: readonly string[];
}

export interface Experience {
  /** Âncora em `/experiencia#slug`. */
  slug: string;
  company: string;
  /** Página da empresa. Ausente de propósito em alguns casos (ex.: Trio). */
  companyUrl?: string;
  role: string;
  /** Detalhe do vínculo (ex.: "alocado na MAG Finanças", "meio período"). */
  engagement?: string;
  /** Cidade do vínculo; ausente quando o LinkedIn não registra (remoto). */
  location?: string;
  mode: WorkMode;
  start: YearMonth;
  /** `null` = vínculo atual. */
  end: YearMonth | null;
  /** Parágrafos de abertura. */
  summary: readonly string[];
  groups: readonly ExperienceGroup[];
  /** Chaves de `content/pt-BR/stack.ts`. */
  stack: readonly string[];
  /** Aparece na prévia da home. */
  highlight?: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number | null;
  endYear: number | null;
}

export interface Certificate {
  slug: string;
  title: string;
  issuer: string;
  issued: YearMonth | null;
  url: string | null;
  /** Entradas sem data nem link ficam guardadas, mas fora da página. */
  visible: boolean;
}

export interface StackItem {
  /** Chave usada nas experiências. */
  key: string;
  label: string;
  /** Nome do export em `simple-icons` (ex.: `siReact`). */
  icon?: string;
}

export interface StackGroup {
  title: string;
  items: readonly StackItem[];
}
