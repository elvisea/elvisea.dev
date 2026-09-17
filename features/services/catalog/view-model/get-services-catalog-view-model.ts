/**
 * View-model do catálogo (`/servicos`) e da seção de serviços da home.
 * Função pura sobre o repository: a View só renderiza o que sai daqui.
 */
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import {
  servicesRepository,
  type ServicesRepository,
} from "@/features/services/repository/services-repository";
import {
  contactHrefFor,
  SERVICES_PATH,
  servicePath,
} from "@/features/services/routes";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface ServiceCardModel {
  slug: string;
  href: string;
  title: string;
  summary: string;
  stack: readonly string[];
}

export interface ServicesCatalogViewModel {
  header: typeof servicosPage.header;
  services: readonly ServiceCardModel[];
  cardMore: string;
  contact: {
    title: string;
    description: string;
    cta: string;
    href: string;
  };
  breadcrumb: readonly BreadcrumbItem[];
}

export function getServicesCatalogViewModel(
  repository: ServicesRepository = servicesRepository,
): ServicesCatalogViewModel {
  return {
    header: servicosPage.header,
    services: repository.list().map((service) => ({
      slug: service.slug,
      href: servicePath(service.slug),
      title: service.shortTitle,
      summary: service.summary,
      stack: service.stack,
    })),
    cardMore: servicosPage.card.more,
    contact: { ...servicosPage.catalogContact, href: contactHrefFor() },
    breadcrumb: [{ name: servicosPage.label, path: SERVICES_PATH }],
  };
}
