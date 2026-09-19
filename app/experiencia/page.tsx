import { SectionHeader } from "@/components/molecules/section-header";
import { ExperienceTimeline } from "@/components/organisms/experience-timeline";
import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import { getExperiences } from "@/lib/content";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: experienciaPage.metaTitle,
  description: experienciaPage.metaDescription,
  path: "/experiencia",
});

export default function ExperienciaPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd
        breadcrumb={[{ name: experienciaPage.metaTitle, path: "/experiencia" }]}
      />
      <SectionHeader
        as="h1"
        description={experienciaPage.header.description}
        eyebrow={experienciaPage.header.eyebrow}
        title={experienciaPage.header.title}
      />
      <div className="max-w-3xl">
        <ExperienceTimeline experiences={getExperiences()} variant="full" />
      </div>
    </div>
  );
}
