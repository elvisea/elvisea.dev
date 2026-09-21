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
  type StackBadgeModel,
  toStackBadges,
} from "@/features/about/domain/stack-badges";
import {
  aboutRepository,
  type AboutRepository,
} from "@/features/about/repository/about-repository";
import { contactHrefFor } from "@/features/contact/routes";
import { SERVICES_PATH, servicePath } from "@/features/services/routes";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface ServiceCardModel {
  slug: string;
  href: string;
  title: string;
  summary: string;
  stack: readonly StackBadgeModel[];
}

export interface ServicesCatalogViewModel {
  header: typeof servicosPage.header;
  services: readonly ServiceCardModel[];
  cardMore: string;
  /** Nome acessível da lista de tecnologias de cada card. */
  cardStackLabel: string;
  contact: {
    title: string;
    description: string;
    cta: string;
    href: string;
  };
  breadcrumb: readonly BreadcrumbItem[];
  metadata: { title: string; description: string; path: string };
}

export function getServicesCatalogViewModel(
  repository: ServicesRepository = servicesRepository,
  about: AboutRepository = aboutRepository,
): ServicesCatalogViewModel {
  return {
    header: servicosPage.header,
    services: repository.list().map((service) => ({
      slug: service.slug,
      href: servicePath(service.slug),
      title: service.shortTitle,
      summary: service.summary,
      stack: toStackBadges(service.stack, about.stackItem),
    })),
    cardMore: servicosPage.card.more,
    cardStackLabel: servicosPage.detail.stack,
    contact: { ...servicosPage.catalogContact, href: contactHrefFor() },
    breadcrumb: [{ name: servicosPage.label, path: SERVICES_PATH }],
    metadata: {
      title: servicosPage.metaTitle,
      description: servicosPage.metaDescription,
      path: SERVICES_PATH,
    },
  };
}
