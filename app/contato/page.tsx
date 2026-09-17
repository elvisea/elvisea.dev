import { ArrowUpRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { ContactForm } from "@/components/organisms/contact-form";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { site } from "@/content/pt-BR/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: contatoPage.metaTitle,
  description: contatoPage.metaDescription,
  path: "/contato",
});

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeader
        as="h1"
        description={contatoPage.header.description}
        eyebrow={contatoPage.header.eyebrow}
        title={contatoPage.header.title}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <ContactForm />
        <aside className="h-fit space-y-3 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-mono text-xs tracking-wide text-highlight uppercase">
            {contatoPage.aside.title}
          </h2>
          <ul className="space-y-1">
            {Object.values(site.links).map((link) => (
              <li key={link.href}>
                <a
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                  <ArrowUpRightIcon aria-hidden className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
