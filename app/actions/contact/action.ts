"use server";

import { headers } from "next/headers";

import { contatoMessages } from "@/content/pt-BR/pages/contato";

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

  // Robôs: responde sucesso sem enviar, para não ensinar o que foi detectado.
  const tooFast = startedAt === null || Date.now() - startedAt < MIN_FILL_MS;
  if (honeypot || tooFast) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: contatoMessages.validationSummary,
      fieldErrors: fieldErrorsFromIssues(parsed.error.issues),
      values,
    };
  }

  try {
    await sendContactMessage(parsed.data, await clientIp());
    return { ok: true };
  } catch (err) {
    if (err instanceof ContactError) {
      return { ok: false, error: err.message, values };
    }
    console.error("[contact] erro inesperado:", err);
    return { ok: false, error: contatoMessages.sendFailed, values };
  }
}
