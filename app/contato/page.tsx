/** Rota `/contato`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getContactViewModel } from "@/features/contact/form/view-model/get-contact-view-model";
import { ContactView } from "@/features/contact/form/view/contact-view";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(getContactViewModel().metadata);

export default function ContatoPage() {
  return <ContactView model={getContactViewModel()} />;
}
