import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
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
    <section
      className="scroll-mt-20 border-b border-border bg-surface py-20"
      id="servicos"
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionHeader
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {model.services.map((service) => (
            <li key={service.slug}>
              <ServiceCard moreLabel={model.cardMore} service={service} />
            </li>
          ))}
        </ul>
        <Link
          className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
          href={SERVICES_PATH}
        >
          {allLabel}
          <ArrowRightIcon aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
