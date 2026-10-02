/**
 * Termos que nunca podem aparecer no site: nichos sensíveis e empregadores
 * internos (regras de conteúdo do `AGENTS.md`).
 *
 * A lista não fica no repositório, que é público: vem de `FORBIDDEN_TERMS`,
 * separada por vírgula (secret da CI; `.env.test.local` na máquina, que o
 * `bun test` carrega e o `.env.local` não). Os achados
 * saem como posição na lista ("termo 3 de 6"), nunca como o termo, porque o
 * log da CI também é público.
 */

export type ForbiddenTermsSource = {
  terms: string[];
  /** Na CI a lista é obrigatória: sem ela, o teste falha em vez de pular. */
  required: boolean;
};

export function parseForbiddenTerms(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

export function forbiddenTermsFromEnv(
  env: Record<string, string | undefined> = process.env,
): ForbiddenTermsSource {
  return {
    terms: parseForbiddenTerms(env.FORBIDDEN_TERMS),
    required: env.CI === "true",
  };
}

/** Avisa quando a lista falta fora da CI: o teste é pulado e isso precisa aparecer. */
export function warnIfSkipped(source: ForbiddenTermsSource): void {
  if (!source.required && source.terms.length === 0) {
    console.warn(
      "FORBIDDEN_TERMS ausente (.env.test.local): verificação de termos sensíveis pulada.",
    );
  }
}

const escape = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Termos encontrados em `text`, como "termo N de M".
 * `wholeWord`: só palavra inteira ("acmeísmo" não dispara "acme").
 * Sem ele, vale como trecho (pega nomes colados, como `nome_app`).
 */
export function findForbiddenTerms(
  text: string,
  terms: readonly string[],
  { wholeWord = false }: { wholeWord?: boolean } = {},
): string[] {
  const haystack = text.toLowerCase();
  return terms.flatMap((term, index) => {
    const pattern = wholeWord
      ? new RegExp(`(?<![\\p{L}\\p{N}])${escape(term)}(?![\\p{L}\\p{N}])`, "u")
      : new RegExp(escape(term), "u");
    return pattern.test(haystack)
      ? [`termo ${index + 1} de ${terms.length}`]
      : [];
  });
}
