/** Rotas da feature de serviços, usadas por view-models, sitemap e home. */
export const SERVICES_PATH = "/servicos";

export function servicePath(slug: string): string {
  return `${SERVICES_PATH}/${slug}`;
}

/** Link do contato já com o assunto "projeto" e, se houver, o serviço. */
export function contactHrefFor(serviceSlug?: string): string {
  const params = new URLSearchParams({ assunto: "projeto" });
  if (serviceSlug) params.set("servico", serviceSlug);
  return `/contato?${params.toString()}`;
}
