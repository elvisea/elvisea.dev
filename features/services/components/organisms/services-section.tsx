import { ArrowLink } from "@/components/atoms/arrow-link";
import { SectionTemplate } from "@/components/templates/section-template";
import type { ServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServiceCard } from "@/features/services/components/molecules/service-card";
import { SERVICES_PATH } from "@/features/services/routes";

interface ServicesSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  allLabel: string;
  model: ServicesCatalogViewModel;
}

/** Seção de serviços da home: cards e link para o catálogo. */
export function ServicesSection({
  eyebrow,
  title,
  description,
  allLabel,
  model,
}: ServicesSectionProps) {
  return (
    <SectionTemplate
      header={{ eyebrow, title, description }}
      id="servicos"
      surface
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {model.services.map((service) => (
          <li key={service.slug}>
            <ServiceCard
              moreLabel={model.cardMore}
              service={service}
              stackLabel={model.cardStackLabel}
            />
          </li>
        ))}
      </ul>
      <ArrowLink href={SERVICES_PATH}>{allLabel}</ArrowLink>
    </SectionTemplate>
  );
}
