import { ArrowUpRightIcon } from "lucide-react";

import { formacao } from "@/content/pt-BR/formacao";
import { sobrePage } from "@/content/pt-BR/pages/profissional";
import { getVisibleCertificates } from "@/lib/content";
import { formatYearMonth } from "@/lib/content/dates";

export function EducationList() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {formacao.map((item) => {
        const years =
          item.startYear && item.endYear
            ? `${item.startYear} – ${item.endYear}`
            : null;
        return (
          <li
            key={item.institution}
            className="space-y-1 rounded-xl border border-border bg-card p-5"
          >
            <p className="font-semibold text-heading">{item.institution}</p>
            <p className="text-foreground">
              {item.degree} em {item.field}
            </p>
            {years ? (
              <p className="font-mono text-xs text-muted-foreground">{years}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function CertificateList() {
  const certificates = getVisibleCertificates();

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {certificates.map((cert) => (
        <li
          key={cert.slug}
          className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div>
            <p className="font-medium text-heading">{cert.title}</p>
            <p className="text-sm text-muted-foreground">
              {cert.issuer} ·{" "}
              {cert.issued
                ? formatYearMonth(cert.issued)
                : sobrePage.certificados.noDate}
            </p>
          </div>
          {cert.url ? (
            <a
              aria-label={`${sobrePage.certificados.view}: ${cert.title}`}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline sm:min-h-0"
              href={cert.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {sobrePage.certificados.view}
              <ArrowUpRightIcon aria-hidden className="size-4" />
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
