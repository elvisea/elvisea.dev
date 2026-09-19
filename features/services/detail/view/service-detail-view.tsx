import Link from "next/link";

import { InfoIcon } from "lucide-react";

import { ArrowLink } from "@/components/atoms/arrow-link";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { CtaCard } from "@/components/molecules/cta-card";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { StackBadges } from "@/components/molecules/stack-badges";
import { PageTemplate } from "@/components/templates/page-template";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckList } from "@/features/services/components/molecules/check-list";
import { ServiceEvidence } from "@/features/services/components/organisms/service-evidence";
import { ServiceFaq } from "@/features/services/components/organisms/service-faq";
import type { ServiceDetailViewModel } from "@/features/services/detail/view-model/get-service-detail-view-model";
import { cn } from "cn";

const sectionTitle = "text-2xl font-bold tracking-tight text-heading";

/** Página de um serviço (`/servicos/<slug>`). */
export function ServiceDetailView({
  model,
}: {
  model: ServiceDetailViewModel;
}) {
  const { service, labels } = model;

  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} nodes={model.jsonLd} />
      <PageTemplate className="space-y-16" width="medium">
        <header className="space-y-6">
          <ArrowLink direction="back" href={model.backHref} size="sm">
            {labels.back}
          </ArrowLink>
          <div className="space-y-4">
            <Eyebrow>{model.eyebrow}</Eyebrow>
            <h1 className="text-3xl font-bold tracking-tight text-balance text-heading md:text-4xl">
              {service.title}
            </h1>
            <p className="text-lg text-pretty text-muted-foreground">
              {service.summary}
            </p>
          </div>
          <Link
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            href={model.contact.href}
          >
            {model.contact.title}
          </Link>
        </header>

        <div className="grid gap-12 md:grid-cols-2">
          <section className="space-y-5">
            <h2 className={sectionTitle}>{labels.forWho}</h2>
            <CheckList items={service.forWho} />
          </section>
          <section className="space-y-5">
            <h2 className={sectionTitle}>{labels.deliverables}</h2>
            <CheckList items={service.deliverables} />
          </section>
        </div>

        <section className="space-y-5">
          <h2 className={sectionTitle}>{labels.process}</h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardHeader>
                    <Badge className="w-fit font-mono" variant="outline">
                      {String(index + 1).padStart(2, "0")}
                    </Badge>
                    <CardTitle className="text-base font-semibold text-heading">
                      <h3>{step.title}</h3>
                    </CardTitle>
                    <CardDescription className="text-pretty text-foreground">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-5">
          <h2 className={sectionTitle}>{labels.evidence}</h2>
          <ServiceEvidence
            items={model.evidence}
            linkLabel={labels.evidenceLink}
          />
        </section>

        <section className="space-y-5">
          <h2 className={sectionTitle}>{labels.stack}</h2>
          <StackBadges keys={service.stack} label={labels.stack} />
        </section>

        <section className="space-y-5">
          <h2 className={sectionTitle}>{labels.faq}</h2>
          {service.note ? (
            <Alert>
              <InfoIcon aria-hidden />
              <AlertTitle>{labels.note}</AlertTitle>
              <AlertDescription className="text-pretty">
                {service.note}
              </AlertDescription>
            </Alert>
          ) : null}
          <ServiceFaq items={model.faq} />
        </section>

        <CtaCard {...model.contact} />
      </PageTemplate>
    </>
  );
}
