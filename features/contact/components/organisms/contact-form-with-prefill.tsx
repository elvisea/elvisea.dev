"use client";

/**
 * Lê `assunto` e `servico` da URL e repassa ao formulário. Fica num componente
 * próprio porque `useSearchParams` exige `Suspense` numa página estática.
 */
import { useSearchParams } from "next/navigation";

import { ContactForm } from "@/features/contact/components/organisms/contact-form";
import { parseContactPrefill } from "@/features/contact/form/prefill";
import type { ContactFormTexts } from "@/features/contact/form/view-model/get-contact-view-model";
import type { ServiceOption } from "@/features/services/repository/services-repository";

export function ContactFormWithPrefill({
  texts,
  services,
}: {
  texts: ContactFormTexts;
  services: readonly ServiceOption[];
}) {
  const params = useSearchParams();
  const prefill = parseContactPrefill(params, {
    reasons: texts.fields.reason.options.map((option) => option.value),
    services,
  });
  return <ContactForm prefill={prefill} texts={texts} />;
}
