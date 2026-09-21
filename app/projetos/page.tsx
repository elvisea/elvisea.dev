/** Rota `/projetos`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getProjectsViewModel } from "@/features/projects/catalog/view-model/get-projects-view-model";
import { ProjectsView } from "@/features/projects/catalog/view/projects-view";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(getProjectsViewModel().metadata);

export default function ProjetosPage() {
  return <ProjectsView model={getProjectsViewModel()} />;
}
