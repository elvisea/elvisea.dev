"use client";

/**
 * Lê `assunto` e `servico` da URL e repassa ao formulário. Fica num componente
 * próprio porque `useSearchParams` exige `Suspense` numa página estática.
 */
import { useSearchParams } from "next/navigation";

import type { ServiceOption } from "@/features/services/repository/services-repository";
import { parseContactPrefill } from "@/lib/contact/prefill";

import { ContactForm } from "./contact-form";

export function ContactFormWithPrefill({
  services,
}: {
  services: readonly ServiceOption[];
}) {
  const params = useSearchParams();
  return <ContactForm prefill={parseContactPrefill(params, services)} />;
}
