import { ArrowUpRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
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

export function CertificateList() {
  const certificates = getVisibleCertificates();

  return (
    <Card className="py-2">
      <ItemGroup className="gap-0">
        {certificates.map((cert, index) => (
          <div key={cert.slug} role="listitem">
            {index > 0 ? <ItemSeparator className="my-0" /> : null}
            <Item className="px-5 py-3.5">
              <ItemContent>
                <ItemTitle className="text-base text-heading">
                  {cert.title}
                </ItemTitle>
                <ItemDescription>
                  {cert.issuer} ·{" "}
                  {cert.issued
                    ? formatYearMonth(cert.issued)
                    : sobrePage.certificados.noDate}
                </ItemDescription>
              </ItemContent>
              {cert.url ? (
                <ItemActions>
                  <a
                    aria-label={`${sobrePage.certificados.view}: ${cert.title}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "h-11 text-primary sm:h-7",
                    )}
                    href={cert.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {sobrePage.certificados.view}
                    <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
                  </a>
                </ItemActions>
              ) : null}
            </Item>
          </div>
        ))}
      </ItemGroup>
    </Card>
  );
}
