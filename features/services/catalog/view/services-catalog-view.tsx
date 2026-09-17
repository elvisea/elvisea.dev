import Link from "next/link";

import { SectionHeader } from "@/components/molecules/section-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServiceCard } from "@/features/services/components/molecules/service-card";
import { PageJsonLd } from "@/lib/seo/json-ld";
import { cn } from "cn";

/** Catálogo de serviços (`/servicos`). */
export function ServicesCatalogView({
  model,
}: {
  model: ServicesCatalogViewModel;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <SectionHeader
        as="h1"
        description={model.header.description}
        eyebrow={model.header.eyebrow}
        title={model.header.title}
      />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {model.services.map((service) => (
          <li key={service.slug}>
            <ServiceCard
              headingLevel="h2"
              moreLabel={model.cardMore}
              service={service}
            />
          </li>
        ))}
      </ul>
      <Card className="bg-surface">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-heading">
            <h2>{model.contact.title}</h2>
          </CardTitle>
          <CardDescription className="text-pretty text-foreground">
            {model.contact.description}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            href={model.contact.href}
          >
            {model.contact.cta}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
