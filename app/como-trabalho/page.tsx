/** Rota `/como-trabalho`: só metadata e a View (MVVM, ver AGENTS.md). */
import {
  getHowIWorkViewModel,
  howIWorkMetadata,
} from "@/features/how-i-work/page/view-model/get-how-i-work-view-model";
import { HowIWorkView } from "@/features/how-i-work/page/view/how-i-work-view";

export const dynamic = "force-static";

export const metadata = howIWorkMetadata;

export default async function ComoTrabalhoPage() {
  return <HowIWorkView model={await getHowIWorkViewModel()} />;
}
