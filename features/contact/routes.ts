/** Rotas da feature de contato, usadas pelos serviços, pela home e pelo sitemap. */
export const CONTACT_PATH = "/contato";

/** Assunto "projeto": pré-selecionado quando o contato vem de um serviço. */
export const PROJECT_REASON = "projeto";

/** Link do contato já com o assunto "projeto" e, se houver, o serviço. */
export function contactHrefFor(serviceSlug?: string): string {
  const params = new URLSearchParams({ assunto: PROJECT_REASON });
  if (serviceSlug) params.set("servico", serviceSlug);
  return `${CONTACT_PATH}?${params.toString()}`;
}
