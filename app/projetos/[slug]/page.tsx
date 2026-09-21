/**
 * Rota `/projetos/[slug]`: estudos de caso (`content/pt-BR/projetos/casos/`).
 * Só existem para projetos marcados com `caseStudy` em `config.ts`; qualquer
 * outro slug responde 404 (`dynamicParams = false`).
 */
import { notFound } from "next/navigation";

import {
  getCaseStudyMetadata,
  getCaseStudySlugs,
  getCaseStudyViewModel,
} from "@/features/projects/case-study/view-model/get-case-study-view-model";
import { CaseStudyView } from "@/features/projects/case-study/view/case-study-view";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const metadata = getCaseStudyMetadata((await params).slug);
  return metadata ? pageMetadata(metadata) : {};
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const model = await getCaseStudyViewModel((await params).slug);
  if (!model) notFound();
  return <CaseStudyView model={model} />;
}
