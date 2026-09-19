/**
 * Rota `/blog` — listagem completa dos posts publicados.
 *
 * RSC com `dynamic = "force-static"`: o HTML é gerado em build a partir
 * de `getAllPosts()`. Adicionar/remover post requer rebuild para refletir
 * em produção (em dev, o `next dev` já recompila a cada save).
 *
 * Layout: cabeçalho da seção + `BlogList` (grid responsivo). Header e
 * rodapé vêm do `app/layout.tsx`. Sem posts publicados, `BlogList`
 * renderiza o estado vazio e a página recebe `noindex` (ver `metadata.ts`).
 */
import { BlogList } from "@/components/organisms/blog-list";
import { blogPage } from "@/content/pt-BR/pages/blog";
import { getAllPosts } from "@/lib/blog";
import { PageJsonLd } from "@/components/molecules/page-json-ld";

import { blogIndexMetadata } from "./metadata";

export async function generateMetadata() {
  return blogIndexMetadata((await getAllPosts()).length);
}

export const dynamic = "force-static";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageJsonLd breadcrumb={[{ name: blogPage.metaTitle, path: "/blog" }]} />
      <section className="border-b border-border bg-background py-20 lg:py-24">
        <div className="mx-auto max-w-6xl space-y-5 px-4 sm:px-6">
          <p className="font-mono text-sm text-highlight">
            {blogPage.header.eyebrow}
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-heading md:text-4xl">
            {blogPage.header.title}
          </h1>
          <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
            {blogPage.header.description}
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  );
}
