/** Formação e certificados prontos para exibir (anos e datas em texto). */
import type { Certificate, Education } from "@/lib/content/types";
import { formatYearMonth } from "@/lib/content/dates";

export interface EducationModel {
  institution: string;
  degree: string;
  field: string;
  /** "2019 – 2023", ou `null` quando o período não está completo. */
  years: string | null;
}

export interface CertificateModel {
  slug: string;
  title: string;
  issuer: string;
  /** Data de emissão; `iso` só existe quando há data (vira `<time>`). */
  date: { label: string; iso?: string };
  url?: string;
}

export function toEducationModel(item: Education): EducationModel {
  return {
    institution: item.institution,
    degree: item.degree,
    field: item.field,
    years:
      item.startYear && item.endYear
        ? `${item.startYear} – ${item.endYear}`
        : null,
  };
}

export function toCertificateModel(
  certificate: Certificate,
  noDateLabel: string,
): CertificateModel {
  return {
    slug: certificate.slug,
    title: certificate.title,
    issuer: certificate.issuer,
    date: certificate.issued
      ? { label: formatYearMonth(certificate.issued), iso: certificate.issued }
      : { label: noDateLabel },
    url: certificate.url ?? undefined,
  };
}
