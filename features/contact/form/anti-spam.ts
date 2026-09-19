/**
 * Sinais de robô sem captcha: o campo isca e o tempo de preenchimento.
 *
 * A action checa a isca antes da validação e o tempo depois dela: envio vazio
 * ou inválido sempre mostra os erros, nunca a confirmação falsa.
 */
import type { ContactFormData } from "./form-data";

/** Envio mais rápido que isso depois de abrir o formulário é tratado como robô. */
export const MIN_FILL_MS = 3_000;

export interface BotSignals {
  /** Campo isca preenchido. */
  honeypot: boolean;
  /** Tempo entre abrir e enviar; `null` sem `startedAt` (JavaScript não carregou). */
  elapsedMs: number | null;
  /** Preenchido rápido demais. Sem `startedAt` não bloqueia, para não descartar em silêncio a mensagem de alguém real. */
  tooFast: boolean;
}

export function detectBot(
  { honeypot, startedAt }: Pick<ContactFormData, "honeypot" | "startedAt">,
  now: number,
): BotSignals {
  const elapsedMs = startedAt === null ? null : now - startedAt;
  return {
    honeypot: honeypot !== "",
    elapsedMs,
    tooFast: elapsedMs !== null && elapsedMs < MIN_FILL_MS,
  };
}
