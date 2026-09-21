/** Leitura do `FormData` enviado pelo formulário de contato. */
import type { ContactFormValues } from "./validations";

export interface ContactFormData {
  values: ContactFormValues;
  /** Campo isca (`website`): pessoas não veem, robôs preenchem. */
  honeypot: string;
  /** Momento em que o formulário foi montado no navegador (ms), se houver. */
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
      service: text(formData, "service"),
    },
    honeypot: text(formData, "website"),
    startedAt: Number.isFinite(startedAt) && startedAt > 0 ? startedAt : null,
  };
}
