/**
 * Pré-preenchimento do formulário de contato a partir da URL
 * (`/contato?assunto=projeto&servico=<slug>`), usado pelos botões das páginas
 * de serviço. Função pura: valores desconhecidos são ignorados.
 */
import { PROJECT_REASON } from "@/features/contact/routes";
import type { ServiceOption } from "@/features/services/repository/services-repository";

export interface ContactPrefill {
  reason: string | null;
  service: ServiceOption | null;
}

export function parseContactPrefill(
  params: Pick<URLSearchParams, "get">,
  options: { reasons: readonly string[]; services: readonly ServiceOption[] },
): ContactPrefill {
  const service =
    options.services.find((option) => option.slug === params.get("servico")) ??
    null;
  const assunto = params.get("assunto");
  const reason =
    assunto && options.reasons.includes(assunto)
      ? assunto
      : service
        ? PROJECT_REASON
        : null;
  return { reason, service };
}
