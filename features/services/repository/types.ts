/**
 * Contrato do conteúdo de serviços (`content/pt-BR/servicos.ts`).
 *
 * Regras (AGENTS.md): só fatos com evidência, sem preço, prazo, garantia ou
 * número inventado. Projetos de nicho sensível entram sem nome e sem link.
 */

/** Origem da evidência; define o rótulo exibido. */
export type EvidenceKind = "experiencia" | "projeto-proprio" | "codigo-aberto";

export interface ServiceEvidence {
  kind: EvidenceKind;
  /** Empresa ou nome do projeto. */
  title: string;
  description: string;
  /** `/experiencia#<slug>` ou URL de repositório público do GitHub. */
  href?: string;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface Service {
  /** URL em `/servicos/<slug>`. */
  slug: string;
  /** H1 da página. */
  title: string;
  /** Cards, trilha e assunto do contato. */
  shortTitle: string;
  /** Sem o sufixo ` · Nome` (o layout aplica). */
  metaTitle: string;
  metaDescription: string;
  summary: string;
  forWho: readonly string[];
  deliverables: readonly string[];
  process: readonly ServiceStep[];
  evidence: readonly ServiceEvidence[];
  /** Chaves de `content/pt-BR/stack.ts`. */
  stack: readonly string[];
  /** Aviso de transparência exibido antes do FAQ (ex.: WhatsApp não oficial). */
  note?: string;
  /** Perguntas deste serviço; as comuns vêm de `pages/servicos.ts`. */
  faq: readonly ServiceFaqItem[];
}
