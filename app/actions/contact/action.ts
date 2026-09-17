"use server";

import { headers } from "next/headers";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import { logger } from "@/lib/log/logger";

import { ContactError } from "./errors";
import {
  contactSchema,
  fieldErrorsFromIssues,
  MIN_FILL_MS,
  readContactFormData,
  type ContactFormValues,
} from "./schema";
import { sendContactMessage } from "./service";

export type ContactActionState =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      values?: ContactFormValues;
    };

/**
 * IP do cliente a partir do header indicado em `TRUSTED_IP_HEADER` (ex.:
 * `cf-connecting-ip` atrás da Cloudflare). O padrão é o primeiro valor de
 * `x-forwarded-for`, que só é confiável se o proxy o sobrescrever.
 */
async function clientIp(): Promise<string> {
  const list = await headers();
  const name = process.env.TRUSTED_IP_HEADER ?? "x-forwarded-for";
  const value = list.get(name);
  return value?.split(",")[0]?.trim() || "unknown";
}

export async function submitContact(
  _prev: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  const { values, honeypot, startedAt } = readContactFormData(formData);

  // Campo isca preenchido: robô. Sucesso falso, sem enviar, para não ensinar
  // o que foi detectado.
  if (honeypot) {
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
  // robô, sucesso falso. Sem `startedAt` (JavaScript não carregou) não bloqueia,
  // para não descartar em silêncio a mensagem de alguém real.
  const elapsedMs = startedAt === null ? null : Date.now() - startedAt;
  if (elapsedMs !== null && elapsedMs < MIN_FILL_MS) {
    logger.info("contact.rejected.too_fast", { elapsedMs });
    return { ok: true };
  }

  try {
    await sendContactMessage(parsed.data, await clientIp());
    return { ok: true };
  } catch (err) {
    // ContactError já foi registrado pelo service.
    if (err instanceof ContactError) {
      return { ok: false, error: err.message, values };
    }
    logger.error("contact.unexpected_error", { error: err });
    return { ok: false, error: contatoMessages.sendFailed, values };
  }
}
