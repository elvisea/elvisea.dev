/** Rota `/servicos`: só metadata e a View do catálogo (MVVM, ver AGENTS.md). */
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { getServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServicesCatalogView } from "@/features/services/catalog/view/services-catalog-view";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: servicosPage.metaTitle,
  description: servicosPage.metaDescription,
  path: "/servicos",
});

export default function ServicosPage() {
  return <ServicesCatalogView model={getServicesCatalogViewModel()} />;
}
