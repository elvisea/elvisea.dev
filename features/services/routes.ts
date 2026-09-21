/** Rotas da feature de serviços, usadas por view-models, sitemap e home. */
export const SERVICES_PATH = "/servicos";

export function servicePath(slug: string): string {
  return `${SERVICES_PATH}/${slug}`;
}
