import { ArrowLink } from "@/components/atoms/arrow-link";
import { SectionTemplate } from "@/components/templates/section-template";
import { ServiceCard } from "@/features/services/components/molecules/service-card";
import type { ServiceCardModel } from "@/features/services/domain/service-card";

interface ServicesSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly ServiceCardModel[];
  cardMore: string;
  cardStackLabel: string;
  all: { href: string; label: string };
}

/** Seção de serviços da home: cards e link para o catálogo. */
export function ServicesSection({
  eyebrow,
  title,
  description,
  cards,
  cardMore,
  cardStackLabel,
  all,
}: ServicesSectionProps) {
  return (
    <SectionTemplate
      header={{ eyebrow, title, description }}
      id="servicos"
      surface
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((service) => (
          <li key={service.slug}>
            <ServiceCard
              moreLabel={cardMore}
              service={service}
              stackLabel={cardStackLabel}
            />
          </li>
        ))}
      </ul>
      <ArrowLink href={all.href}>{all.label}</ArrowLink>
    </SectionTemplate>
  );
}
