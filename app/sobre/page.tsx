/** Rota `/sobre`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getAboutViewModel } from "@/features/about/profile/view-model/get-about-view-model";
import { AboutView } from "@/features/about/profile/view/about-view";

export const metadata = getAboutViewModel().metadata;

export default function SobrePage() {
  return <AboutView model={getAboutViewModel()} />;
}
