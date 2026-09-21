/** Rota `/curriculo`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getResumeViewModel } from "@/features/resume/files/view-model/get-resume-view-model";
import { ResumeView } from "@/features/resume/files/view/resume-view";

export const metadata = getResumeViewModel().metadata;

export default function CurriculoPage() {
  return <ResumeView model={getResumeViewModel()} />;
}
