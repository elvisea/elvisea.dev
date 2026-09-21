/** Rota `/`: só metadata e a View (MVVM, ver AGENTS.md). */
import {
  getHomeViewModel,
  homeMetadata,
} from "@/features/home/home/view-model/get-home-view-model";
import { HomeView } from "@/features/home/home/view/home-view";

export const metadata = homeMetadata;

export default async function HomePage() {
  return <HomeView model={await getHomeViewModel()} />;
}
