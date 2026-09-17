/**
 * Estudos de caso de projetos (`content/pt-BR/projetos/casos/<slug>.md`).
 * Só existem para projetos marcados com `caseStudy` em `config.ts`; qualquer
 * outro slug responde 404.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { PostBody } from "@/components/organisms/post-body";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { renderContentPage } from "@/lib/content/markdown-page";
import { getCaseStudies } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

function findCaseStudy(slug: string) {
  return getCaseStudies().find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary ?? undefined,
    path: `/projetos/${slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) notFound();

  const html = await renderContentPage(`projetos/casos/${slug}`);

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:py-20">
      <Link
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        href="/projetos"
      >
        <ArrowLeftIcon aria-hidden className="size-4" />
        {projetosPage.caseStudy.back}
      </Link>
      <SectionHeader
        as="h1"
        description={project.summary ?? undefined}
        eyebrow={projetosPage.header.eyebrow}
        title={project.title}
      />
      <PostBody html={html} />
    </div>
  );
}
