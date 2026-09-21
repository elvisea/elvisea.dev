/**
 * Validação do formulário de contato.
 *
 * `website` (isca) e `startedAt` (início do preenchimento) ficam fora do
 * schema: são sinais de robô, checados em `anti-spam.ts`.
 */
import { z } from "zod";

import {
  contatoMessages as m,
  contatoPage,
} from "@/content/pt-BR/pages/contato";
import { listServiceOptions } from "@/features/services/repository/services-repository";

const reasons = contatoPage.fields.reason.options.map((o) => o.value) as [
  string,
  ...string[],
];

const serviceSlugs = listServiceOptions().map((s) => s.slug) as [
  string,
  ...string[],
];

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
  // Serviço de origem (campo oculto, vem de /servicos/<slug>). Valor
  // desconhecido é descartado em silêncio: não é erro de quem preenche.
  service: z
    .preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(serviceSlugs).optional(),
    )
    .catch(undefined),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Valores digitados, devolvidos ao formulário quando a validação falha. */
export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  reason: string;
  message: string;
  /** Slug do serviço de origem; vazio quando o contato não veio de um serviço. */
  service: string;
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
