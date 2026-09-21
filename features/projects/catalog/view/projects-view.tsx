import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PageTemplate } from "@/components/templates/page-template";
import type { ProjectsViewModel } from "@/features/projects/catalog/view-model/get-projects-view-model";
import { ProjectExplorer } from "@/features/projects/components/organisms/project-explorer";

/** Catálogo de projetos (`/projetos`). */
export function ProjectsView({ model }: { model: ProjectsViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate header={model.header}>
        <ProjectExplorer cards={model.cards} filter={model.filter} />
      </PageTemplate>
    </>
  );
}
