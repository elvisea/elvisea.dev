/**
 * Validação do formulário de contato.
 *
 * `website` é o honeypot e `startedAt` o momento em que o formulário foi
 * montado; os dois ficam fora do schema e são checados na action.
 */
import { z } from "zod";

import {
  contatoMessages as m,
  contatoPage,
} from "@/content/pt-BR/pages/contato";

const reasons = contatoPage.fields.reason.options.map((o) => o.value) as [
  string,
  ...string[],
];

/** Envio mais rápido que isso depois de abrir o formulário é tratado como robô. */
export const MIN_FILL_MS = 3_000;

export const contactSchema = z.object({
  name: z.string().trim().min(2, m.nameRequired).max(80, m.nameTooLong),
  email: z.string().trim().pipe(z.email(m.emailInvalid)),
  company: z
    .string()
    .trim()
    .max(100, m.companyTooLong)
    .transform((v) => v || undefined),
  reason: z.enum(reasons, { error: m.reasonRequired }),
  message: z
    .string()
    .trim()
    .min(20, m.messageTooShort)
    .max(4000, m.messageTooLong),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Valores digitados, devolvidos ao formulário quando a validação falha. */
export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  reason: string;
  message: string;
}

export interface ContactFormData {
  values: ContactFormValues;
  honeypot: string;
  startedAt: number | null;
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function readContactFormData(formData: FormData): ContactFormData {
  const startedAt = Number(text(formData, "startedAt"));
  return {
    values: {
      name: text(formData, "name"),
      email: text(formData, "email"),
      company: text(formData, "company"),
      reason: text(formData, "reason"),
      message: text(formData, "message"),
    },
    honeypot: text(formData, "website"),
    startedAt: Number.isFinite(startedAt) && startedAt > 0 ? startedAt : null,
  };
}

/** Erros por campo a partir das issues do zod (primeiro nível do path). */
export function fieldErrorsFromIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = typeof issue.path[0] === "string" ? issue.path[0] : "form";
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}
