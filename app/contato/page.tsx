import { Suspense } from "react";

import { ArrowUpRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { ContactForm } from "@/components/organisms/contact-form";
import { ContactFormWithPrefill } from "@/components/organisms/contact-form-with-prefill";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { site } from "@/content/pt-BR/site";
import { listServiceOptions } from "@/features/services/repository/services-repository";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "cn";

export const metadata = pageMetadata({
  title: contatoPage.metaTitle,
  description: contatoPage.metaDescription,
  path: "/contato",
});

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd
        breadcrumb={[{ name: contatoPage.metaTitle, path: "/contato" }]}
      />
      <SectionHeader
        as="h1"
        description={contatoPage.header.description}
        eyebrow={contatoPage.header.eyebrow}
        title={contatoPage.header.title}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        {/* Parâmetros da URL só existem no navegador: o HTML estático traz o
            formulário sem pré-preenchimento, trocado ao hidratar. */}
        <Suspense fallback={<ContactForm />}>
          <ContactFormWithPrefill services={listServiceOptions()} />
        </Suspense>
        <aside className="h-fit">
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle className="font-mono text-xs tracking-wide text-highlight uppercase">
                <h2>{contatoPage.aside.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {Object.values(site.links).map((link) => (
                  <li key={link.href}>
                    <a
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "h-11 px-0 text-base",
                      )}
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                      <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
