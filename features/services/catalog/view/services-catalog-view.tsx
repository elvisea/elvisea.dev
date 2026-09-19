import { CtaCard } from "@/components/molecules/cta-card";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PageTemplate } from "@/components/templates/page-template";
import type { ServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServiceCard } from "@/features/services/components/molecules/service-card";

/** Catálogo de serviços (`/servicos`). */
export function ServicesCatalogView({
  model,
}: {
  model: ServicesCatalogViewModel;
}) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate header={model.header}>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {model.services.map((service) => (
            <li key={service.slug}>
              <ServiceCard
                headingLevel="h2"
                moreLabel={model.cardMore}
                service={service}
                stackLabel={model.cardStackLabel}
              />
            </li>
          ))}
        </ul>
        <CtaCard {...model.contact} />
      </PageTemplate>
    </>
  );
}
