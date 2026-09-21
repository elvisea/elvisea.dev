/** Rota `/`: só metadata e a View (MVVM, ver AGENTS.md). */
import {
  getHomeViewModel,
  homeMetadata,
} from "@/features/home/page/view-model/get-home-view-model";
import { HomeView } from "@/features/home/page/view/home-view";

export const metadata = homeMetadata;

export default async function HomePage() {
  return <HomeView model={await getHomeViewModel()} />;
}
