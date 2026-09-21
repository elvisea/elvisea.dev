/**
 * Certificados em grade de cards, um por certificado. Com link, o card
 * inteiro é o link para a credencial (abre em nova aba).
 */
import { ArrowUpRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CertificateModel } from "@/features/about/domain/credentials";
import { cn } from "cn";

interface CertificateListProps {
  items: readonly CertificateModel[];
  /** Prefixo só para leitor de tela ("Ver certificado"). */
  viewLabel: string;
}

export function CertificateList({ items, viewLabel }: CertificateListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((certificate) => {
        const card = (
          <Card className="h-full transition-shadow group-hover/cert:ring-primary/50">
            <CardHeader>
              <CardDescription className="font-mono text-xs tracking-wide uppercase">
                {certificate.issuer}
              </CardDescription>
              <CardTitle className="text-base font-semibold text-pretty text-heading">
                {certificate.title}
              </CardTitle>
              {certificate.url ? (
                <CardAction>
                  <ArrowUpRightIcon
                    aria-hidden
                    className="size-4 text-muted-foreground transition-colors group-hover/cert:text-primary"
                  />
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent className="mt-auto">
              <Badge
                className={cn(
                  "font-mono",
                  !certificate.date.iso && "text-muted-foreground",
                )}
                variant="secondary"
              >
                {certificate.date.iso ? (
                  <time dateTime={certificate.date.iso}>
                    {certificate.date.label}
                  </time>
                ) : (
                  certificate.date.label
                )}
              </Badge>
            </CardContent>
          </Card>
        );

        return (
          <li key={certificate.slug}>
            {certificate.url ? (
              <a
                className="group/cert block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                href={certificate.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {/* Prefixo só para leitor de tela: o nome acessível continua contendo o texto visível. */}
                <span className="sr-only">{viewLabel}: </span>
                {card}
              </a>
            ) : (
              card
            )}
          </li>
        );
      })}
    </ul>
  );
}
