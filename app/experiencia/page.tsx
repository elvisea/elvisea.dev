/** Rota `/experiencia`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getExperienceViewModel } from "@/features/experience/timeline/view-model/get-experience-view-model";
import { ExperienceView } from "@/features/experience/timeline/view/experience-view";

export const metadata = getExperienceViewModel().metadata;

export default function ExperienciaPage() {
  return <ExperienceView model={getExperienceViewModel()} />;
}
