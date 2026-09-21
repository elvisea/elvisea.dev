/** Modelo do card de serviço, usado no catálogo e na seção da home. */
import {
  type StackBadgeModel,
  toStackBadges,
} from "@/features/about/domain/stack-badges";
import type { Service } from "@/features/services/repository/types";
import { servicePath } from "@/features/services/routes";
import type { StackItem } from "@/lib/content/types";

export interface ServiceCardModel {
  slug: string;
  href: string;
  title: string;
  summary: string;
  stack: readonly StackBadgeModel[];
}

export function toServiceCardModel(
  service: Service,
  stackItem: (key: string) => StackItem | undefined,
): ServiceCardModel {
  return {
    slug: service.slug,
    href: servicePath(service.slug),
    title: service.shortTitle,
    summary: service.summary,
    stack: toStackBadges(service.stack, stackItem),
  };
}
