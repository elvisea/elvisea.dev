import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { StackBadges } from "@/components/molecules/stack-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import type { ServiceCardModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";

interface ServiceCardProps {
  service: ServiceCardModel;
  moreLabel: string;
  /** `h2` no catálogo (abaixo do H1); `h3` dentro de uma seção da home. */
  headingLevel?: "h2" | "h3";
}

/** Card de um serviço: título curto, resumo, tecnologias e link da página. */
export function ServiceCard({
  service,
  moreLabel,
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
        <StackBadges keys={service.stack} label={servicosPage.detail.stack} />
      </CardContent>
      <CardFooter className="py-2">
        <Link
          aria-hidden
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          href={service.href}
          tabIndex={-1}
        >
          {moreLabel}
          <ArrowRightIcon aria-hidden className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
