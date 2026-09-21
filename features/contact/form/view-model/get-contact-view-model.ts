/**
 * View-model de `/contato`: cabeçalho, textos do formulário, opções de
 * serviço para o pré-preenchimento, outros canais, trilha e metadata.
 */
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { site } from "@/content/pt-BR/site";
import { CONTACT_PATH } from "@/features/contact/routes";
import {
  listServiceOptions,
  servicesRepository,
  type ServiceOption,
  type ServicesRepository,
} from "@/features/services/repository/services-repository";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

/** Textos do formulário, repassados aos componentes de cliente. */
export interface ContactFormTexts {
  fields: typeof contatoPage.fields;
  submit: string;
  submitting: string;
  success: typeof contatoPage.success;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface ContactViewModel {
  header: typeof contatoPage.header;
  form: ContactFormTexts;
  /** Serviços aceitos no pré-preenchimento (`?servico=<slug>`). */
  services: readonly ServiceOption[];
  otherChannels: { title: string; links: readonly ContactLink[] };
  breadcrumb: readonly BreadcrumbItem[];
  metadata: { title: string; description: string; path: string };
}

export function getContactViewModel(
  services: ServicesRepository = servicesRepository,
): ContactViewModel {
  return {
    header: contatoPage.header,
    form: {
      fields: contatoPage.fields,
      submit: contatoPage.submit,
      submitting: contatoPage.submitting,
      success: contatoPage.success,
    },
    services: listServiceOptions(services),
    otherChannels: {
      title: contatoPage.aside.title,
      links: Object.values(site.links).map(({ label, href }) => ({
        label,
        href,
      })),
    },
    breadcrumb: [{ name: contatoPage.metaTitle, path: CONTACT_PATH }],
    metadata: {
      title: contatoPage.metaTitle,
      description: contatoPage.metaDescription,
      path: CONTACT_PATH,
    },
  };
}
