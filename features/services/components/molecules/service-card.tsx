import Link from "next/link";

import { ArrowLink } from "@/components/atoms/arrow-link";
import { StackBadges } from "@/components/molecules/stack-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ServiceCardModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";

interface ServiceCardProps {
  service: ServiceCardModel;
  moreLabel: string;
  /** Nome acessível da lista de tecnologias. */
  stackLabel: string;
  /** `h2` no catálogo (abaixo do H1); `h3` dentro de uma seção da home. */
  headingLevel?: "h2" | "h3";
}

/** Card de um serviço: título curto, resumo, tecnologias e link da página. */
export function ServiceCard({
  service,
  moreLabel,
  stackLabel,
  headingLevel: Heading = "h3",
}: ServiceCardProps) {
  return (
    <Card className="h-full transition-shadow hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-pretty text-heading">
          <Heading>
            <Link
              className="underline-offset-4 outline-none hover:underline focus-visible:underline"
              href={service.href}
            >
              {service.title}
            </Link>
          </Heading>
        </CardTitle>
        <CardDescription className="line-clamp-4 text-pretty text-foreground">
          {service.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <StackBadges items={service.stack} label={stackLabel} />
      </CardContent>
      <CardFooter className="py-2">
        <ArrowLink aria-hidden href={service.href} size="sm" tabIndex={-1}>
          {moreLabel}
        </ArrowLink>
      </CardFooter>
    </Card>
  );
}
