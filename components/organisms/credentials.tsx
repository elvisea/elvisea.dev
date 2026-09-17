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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { formacao } from "@/content/pt-BR/formacao";
import { sobrePage } from "@/content/pt-BR/pages/profissional";
import { getVisibleCertificates } from "@/lib/content";
import { formatYearMonth } from "@/lib/content/dates";
import { cn } from "cn";

export function EducationList() {
  return (
    <ItemGroup className="grid gap-4 md:grid-cols-2">
      {formacao.map((item) => {
        const years =
          item.startYear && item.endYear
            ? `${item.startYear} – ${item.endYear}`
            : null;
        return (
          <Item
            key={item.institution}
            className="bg-card p-5"
            role="listitem"
            variant="outline"
          >
            <ItemContent>
              <ItemTitle className="text-base text-heading">
                {item.institution}
              </ItemTitle>
              <ItemDescription className="text-foreground">
                {item.degree} em {item.field}
              </ItemDescription>
              {years ? (
                <ItemDescription className="font-mono text-xs">
                  {years}
                </ItemDescription>
              ) : null}
            </ItemContent>
          </Item>
        );
      })}
    </ItemGroup>
  );
}

/**
 * Certificados em grade de cards, um por certificado. O card inteiro é o link
 * para a credencial (abre em nova aba).
 */
export function CertificateList() {
  const certificates = getVisibleCertificates();

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((cert) => {
        const date = cert.issued
          ? formatYearMonth(cert.issued)
          : sobrePage.certificados.noDate;

        const card = (
          <Card className="h-full transition-shadow group-hover/cert:ring-primary/50">
            <CardHeader>
              <CardDescription className="font-mono text-xs tracking-wide uppercase">
                {cert.issuer}
              </CardDescription>
              <CardTitle className="text-base font-semibold text-pretty text-heading">
                {cert.title}
              </CardTitle>
              {cert.url ? (
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
                  !cert.issued && "text-muted-foreground",
                )}
                variant="secondary"
              >
                {cert.issued ? (
                  <time dateTime={cert.issued}>{date}</time>
                ) : (
                  date
                )}
              </Badge>
            </CardContent>
          </Card>
        );

        return (
          <li key={cert.slug}>
            {cert.url ? (
              <a
                aria-label={`${sobrePage.certificados.view}: ${cert.title}, ${cert.issuer}, ${date}`}
                className="group/cert block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                href={cert.url}
                rel="noopener noreferrer"
                target="_blank"
              >
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
