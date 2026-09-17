import Link from "next/link";

import { ArrowLeftIcon, CheckIcon, InfoIcon } from "lucide-react";

import { StackBadges } from "@/components/molecules/stack-badges";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceEvidence } from "@/features/services/components/organisms/service-evidence";
import { ServiceFaq } from "@/features/services/components/organisms/service-faq";
import type { ServiceDetailViewModel } from "@/features/services/detail/view-model/get-service-detail-view-model";
import { PageJsonLd } from "@/lib/seo/json-ld";
import { cn } from "cn";

const sectionTitle = "text-2xl font-bold tracking-tight text-heading";

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-pretty text-foreground">
          <CheckIcon
            aria-hidden
            className="mt-1 size-4 shrink-0 text-primary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Página de um serviço (`/servicos/<slug>`). */
export function ServiceDetailView({
  model,
}: {
  model: ServiceDetailViewModel;
}) {
  const { service, labels } = model;

  return (
    <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd breadcrumb={model.breadcrumb} nodes={model.jsonLd} />

      <header className="space-y-6">
        <Link
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          href={model.backHref}
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          {labels.back}
        </Link>
        <div className="space-y-4">
          <p className="font-mono text-sm text-highlight">{model.eyebrow}</p>
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
