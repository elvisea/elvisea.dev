/**
 * Fluxo de um envio do formulário de contato: isca, validação, tempo de
 * preenchimento, envio e tradução dos erros para o formulário.
 *
 * A Server Action só lê a requisição e chama esta função; IP, envio e relógio
 * entram por parâmetro.
 */
import { contatoMessages } from "@/content/pt-BR/pages/contato";
import { detectBot } from "@/features/contact/form/anti-spam";
import type { ContactFormData } from "@/features/contact/form/form-data";
import {
  contactSchema,
  type ContactInput,
  fieldErrorsFromIssues,
} from "@/features/contact/form/validations";
import { logger } from "@/lib/log/logger";

import { ContactError } from "./errors";
import type { ContactActionState } from "./types";

export interface SubmissionDeps {
  send: (input: ContactInput, clientIp: string) => Promise<void>;
  clientIp: () => Promise<string>;
  now: number;
}

/**
 * Mensagem para o formulário a partir de um erro do envio. `ContactError` já
 * foi registrado pelo service; erro inesperado é marcado para registro.
 */
export function mapContactError(err: unknown): {
  message: string;
  unexpected: boolean;
} {
  if (err instanceof ContactError)
    return { message: err.message, unexpected: false };
  return { message: contatoMessages.sendFailed, unexpected: true };
}

export async function processContactSubmission(
  { values, honeypot, startedAt }: ContactFormData,
  deps: SubmissionDeps,
): Promise<ContactActionState> {
  const bot = detectBot({ honeypot, startedAt }, deps.now);

  // Isca preenchida: robô. Sucesso falso, sem enviar, para não ensinar o que
  // foi detectado.
  if (bot.honeypot) {
    logger.info("contact.rejected.honeypot");
    return { ok: true };
  }

  // Validação antes da checagem de tempo: envio vazio ou inválido sempre
  // mostra os erros, nunca a confirmação.
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromIssues(parsed.error.issues);
    // Só os nomes dos campos: valores digitados não vão para o log.
    logger.info("contact.validation_failed", {
      fields: Object.keys(fieldErrors),
    });
    return {
      ok: false,
      error: contatoMessages.validationSummary,
      fieldErrors,
      values,
    };
  }

  // Formulário válido preenchido mais rápido do que uma pessoa conseguiria:
  // robô, sucesso falso.
  if (bot.tooFast) {
    logger.info("contact.rejected.too_fast", { elapsedMs: bot.elapsedMs });
    return { ok: true };
  }

  try {
    await deps.send(parsed.data, await deps.clientIp());
    return { ok: true };
  } catch (err) {
    const { message, unexpected } = mapContactError(err);
    if (unexpected) logger.error("contact.unexpected_error", { error: err });
    return { ok: false, error: message, values };
  }
}
