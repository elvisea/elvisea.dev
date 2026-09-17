import Link from "next/link";

import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EvidenceModel } from "@/features/services/detail/view-model/get-service-detail-view-model";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline";

/** Evidências de um serviço: experiência, projeto próprio ou código aberto. */
export function ServiceEvidence({
  items,
  linkLabel,
}: {
  items: readonly EvidenceModel[];
  linkLabel: string;
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={`${item.kind}-${item.title}`}>
          <Card className="h-full">
            <CardHeader>
              <Badge className="w-fit font-mono" variant="secondary">
                {item.kindLabel}
              </Badge>
              <CardTitle className="text-base font-semibold text-heading">
                <h3>{item.title}</h3>
              </CardTitle>
              <CardDescription className="text-pretty text-foreground">
                {item.description}
              </CardDescription>
            </CardHeader>
            {item.href ? (
              <CardFooter className="mt-auto py-2">
                {item.external ? (
                  <a
                    className={linkClass}
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {linkLabel}
                    <span className="sr-only">: {item.title}</span>
                    <ArrowUpRightIcon aria-hidden className="size-4" />
                  </a>
                ) : (
                  <Link className={linkClass} href={item.href}>
                    {linkLabel}
                    <span className="sr-only">: {item.title}</span>
                    <ArrowRightIcon aria-hidden className="size-4" />
                  </Link>
                )}
              </CardFooter>
            ) : (
              <CardContent className="mt-auto" />
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
