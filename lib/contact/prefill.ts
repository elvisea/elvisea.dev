/**
 * Pré-preenchimento do formulário de contato a partir da URL
 * (`/contato?assunto=projeto&servico=<slug>`), usado pelos botões das páginas
 * de serviço. Função pura: valores desconhecidos são ignorados.
 */
import { contatoPage } from "@/content/pt-BR/pages/contato";
import type { ServiceOption } from "@/features/services/repository/services-repository";

export interface ContactPrefill {
  reason: string | null;
  service: ServiceOption | null;
}

const reasons = new Set<string>(
  contatoPage.fields.reason.options.map((option) => option.value),
);

export function parseContactPrefill(
  params: Pick<URLSearchParams, "get">,
  services: readonly ServiceOption[],
): ContactPrefill {
  const service =
    services.find((option) => option.slug === params.get("servico")) ?? null;
  const assunto = params.get("assunto");
  const reason =
    assunto && reasons.has(assunto) ? assunto : service ? "projeto" : null;
  return { reason, service };
}
