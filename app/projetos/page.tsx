import { SectionHeader } from "@/components/molecules/section-header";
import { ProjectExplorer } from "@/components/organisms/project-explorer";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { getProjectLanguages, getProjects } from "@/lib/projects";
import { PageJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: projetosPage.metaTitle,
  description: projetosPage.metaDescription,
  path: "/projetos",
});

export default function ProjetosPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd
        breadcrumb={[{ name: projetosPage.metaTitle, path: "/projetos" }]}
      />
      <SectionHeader
        as="h1"
        description={projetosPage.header.description}
        eyebrow={projetosPage.header.eyebrow}
        title={projetosPage.header.title}
      />
      <ProjectExplorer
        languages={getProjectLanguages()}
        projects={getProjects()}
      />
    </div>
  );
}
