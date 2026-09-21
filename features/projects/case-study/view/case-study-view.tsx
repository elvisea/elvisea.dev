import { ArrowLink } from "@/components/atoms/arrow-link";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { SectionHeader } from "@/components/molecules/section-header";
import { PostBody } from "@/components/organisms/post-body";
import { PageTemplate } from "@/components/templates/page-template";
import type { CaseStudyViewModel } from "@/features/projects/case-study/view-model/get-case-study-view-model";

/** Estudo de caso de um projeto (`/projetos/<slug>`). */
export function CaseStudyView({ model }: { model: CaseStudyViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate className="space-y-10" width="narrow">
        <ArrowLink direction="back" href={model.back.href} size="sm">
          {model.back.label}
        </ArrowLink>
        <SectionHeader as="h1" {...model.header} />
        <PostBody html={model.html} />
      </PageTemplate>
    </>
  );
}
