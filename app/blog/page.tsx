/** Rota `/blog`: só metadata e a View (MVVM, ver AGENTS.md). */
import { getBlogViewModel } from "@/features/blog/list/view-model/get-blog-view-model";
import { BlogView } from "@/features/blog/list/view/blog-view";

export const dynamic = "force-static";

export async function generateMetadata() {
  return (await getBlogViewModel()).metadata;
}

export default async function BlogIndexPage() {
  return <BlogView model={await getBlogViewModel()} />;
}
