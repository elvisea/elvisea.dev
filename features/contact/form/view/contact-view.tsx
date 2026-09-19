import { Suspense } from "react";

import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PageTemplate } from "@/components/templates/page-template";
import { ContactForm } from "@/features/contact/components/organisms/contact-form";
import { ContactFormWithPrefill } from "@/features/contact/components/organisms/contact-form-with-prefill";
import { OtherChannels } from "@/features/contact/components/organisms/other-channels";
import type { ContactViewModel } from "@/features/contact/form/view-model/get-contact-view-model";

/** Página de contato (`/contato`): formulário e outros canais. */
export function ContactView({ model }: { model: ContactViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate header={model.header}>
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
          {/* Parâmetros da URL só existem no navegador: o HTML estático traz o
              formulário sem pré-preenchimento, trocado ao hidratar. */}
          <Suspense fallback={<ContactForm texts={model.form} />}>
            <ContactFormWithPrefill
              services={model.services}
              texts={model.form}
            />
          </Suspense>
          <OtherChannels {...model.otherChannels} />
        </div>
      </PageTemplate>
    </>
  );
}
