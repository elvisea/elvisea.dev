/**
 * Metadata estática da rota `/blog`. Re-exportada por `app/blog/page.tsx`.
 * Metadata por post fica no `generateMetadata` de `app/blog/[slug]/page.tsx`.
 */
import { blogPage } from "@/content/pt-BR/pages/blog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: blogPage.metaTitle,
  description: blogPage.metaDescription,
  path: "/blog",
});
