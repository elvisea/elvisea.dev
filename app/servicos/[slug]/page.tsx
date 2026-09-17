/**
 * Rota `/servicos/[slug]`: uma página estática por serviço. Slug fora da lista
 * responde 404 (`dynamicParams = false`).
 */
import { notFound } from "next/navigation";

import {
  getServiceDetailViewModel,
  getServiceSlugs,
} from "@/features/services/detail/view-model/get-service-detail-view-model";
import { ServiceDetailView } from "@/features/services/detail/view/service-detail-view";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const model = getServiceDetailViewModel((await params).slug);
  return model ? pageMetadata(model.metadata) : {};
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const model = getServiceDetailViewModel((await params).slug);
  if (!model) notFound();
  return <ServiceDetailView model={model} />;
}
