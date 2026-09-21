"use server";

/**
 * Server Action do formulário de contato: lê a requisição e delega a
 * `processContactSubmission`. Arquivo `"use server"` só exporta funções
 * assíncronas; tipos e constantes ficam em `types.ts` e `form/`.
 */
import { headers } from "next/headers";

import { readContactFormData } from "@/features/contact/form/form-data";

import { getClientIp } from "./client-ip";
import { sendContactMessage } from "./contact-service";
import { processContactSubmission } from "./process-submission";
import type { ContactActionState } from "./types";

export async function submitContact(
  _previous: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  return processContactSubmission(readContactFormData(formData), {
    send: (input, clientIp) => sendContactMessage(input, clientIp),
    clientIp: async () =>
      getClientIp(await headers(), process.env.TRUSTED_IP_HEADER),
    now: Date.now(),
  });
}
