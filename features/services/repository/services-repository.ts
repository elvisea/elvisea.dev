/**
 * Acesso aos serviços. Única porta de entrada para `content/pt-BR/servicos.ts`:
 * view-models e outras features (contato, sitemap) leem daqui.
 */
import { servicos } from "@/content/pt-BR/servicos";

import type { Service } from "./types";

export interface ServicesRepository {
  list(): readonly Service[];
  findBySlug(slug: string): Service | undefined;
}

export function createServicesRepository(
  source: readonly Service[],
): ServicesRepository {
  return {
    list: () => source,
    findBySlug: (slug) => source.find((service) => service.slug === slug),
  };
}

export const servicesRepository = createServicesRepository(servicos);

export interface ServiceOption {
  slug: string;
  title: string;
}

/** Slug e título curto, para o formulário de contato (sem o conteúdo inteiro no navegador). */
export function listServiceOptions(
  repository: ServicesRepository = servicesRepository,
): ServiceOption[] {
  return repository
    .list()
    .map((service) => ({ slug: service.slug, title: service.shortTitle }));
}
