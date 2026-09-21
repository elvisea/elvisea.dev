/** Rota 404: só a View (MVVM, ver AGENTS.md). */
import { getNotFoundViewModel } from "@/features/layout/not-found/view-model/get-not-found-view-model";
import { NotFoundView } from "@/features/layout/not-found/view/not-found-view";

export default function NotFound() {
  return <NotFoundView model={getNotFoundViewModel()} />;
}
