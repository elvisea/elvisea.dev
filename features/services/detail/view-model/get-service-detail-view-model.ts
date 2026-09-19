/**
 * View-model da página de um serviço (`/servicos/<slug>`): textos, evidências
 * com rótulo, FAQ (específicas + comuns), link de contato, trilha, dados
 * estruturados e metadata. `null` para slug inexistente (a rota responde 404).
 */
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import {
  servicesRepository,
  type ServicesRepository,
} from "@/features/services/repository/services-repository";
import type {
  Service,
  ServiceEvidence,
  ServiceFaqItem,
} from "@/features/services/repository/types";
import { contactHrefFor } from "@/features/contact/routes";
import { SERVICES_PATH, servicePath } from "@/features/services/routes";
import {
  type BreadcrumbItem,
  type JsonLdNode,
  serviceNode,
} from "@/lib/seo/structured-data";

export interface EvidenceModel extends ServiceEvidence {
  kindLabel: string;
  /** Link para fora do site (abre em nova aba). */
  external: boolean;
}

export interface ServiceDetailViewModel {
  labels: typeof servicosPage.detail;
  service: Pick<
    Service,
    | "slug"
    | "title"
    | "summary"
    | "forWho"
    | "deliverables"
    | "process"
    | "stack"
    | "note"
  >;
  eyebrow: string;
  backHref: string;
  evidence: readonly EvidenceModel[];
  faq: readonly ServiceFaqItem[];
  contact: { title: string; description: string; cta: string; href: string };
  breadcrumb: readonly BreadcrumbItem[];
  jsonLd: readonly JsonLdNode[];
  metadata: { title: string; description: string; path: string };
}

export function getServiceSlugs(
  repository: ServicesRepository = servicesRepository,
): string[] {
  return repository.list().map((service) => service.slug);
}

export function getServiceDetailViewModel(
  slug: string,
  repository: ServicesRepository = servicesRepository,
): ServiceDetailViewModel | null {
  const service = repository.findBySlug(slug);
  if (!service) return null;

  const path = servicePath(service.slug);

  return {
    labels: servicosPage.detail,
    service: {
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      forWho: service.forWho,
      deliverables: service.deliverables,
      process: service.process,
      stack: service.stack,
      note: service.note,
    },
    eyebrow: servicosPage.label,
    backHref: SERVICES_PATH,
    evidence: service.evidence.map((item) => ({
      ...item,
      kindLabel: servicosPage.evidenceKinds[item.kind],
      external: item.href?.startsWith("http") ?? false,
    })),
    faq: [...service.faq, ...servicosPage.commonFaq],
    contact: { ...servicosPage.contact, href: contactHrefFor(service.slug) },
    breadcrumb: [
      { name: servicosPage.label, path: SERVICES_PATH },
      { name: service.shortTitle, path },
    ],
    jsonLd: [serviceNode(service)],
    metadata: {
      title: service.metaTitle,
      description: service.metaDescription,
      path,
    },
  };
}
