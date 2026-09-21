import { Eyebrow } from "@/components/atoms/eyebrow";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { BlogList } from "@/features/blog/components/organisms/blog-list";
import type { BlogViewModel } from "@/features/blog/list/view-model/get-blog-view-model";

/** Listagem do blog (`/blog`): faixa de cabeçalho e grade de posts. */
export function BlogView({ model }: { model: BlogViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <section className="border-b border-border bg-background py-20 lg:py-24">
        <div className="mx-auto max-w-6xl space-y-5 px-4 sm:px-6">
          <Eyebrow>{model.header.eyebrow}</Eyebrow>
          <h1 className="text-3xl font-bold tracking-tight text-balance text-heading md:text-4xl">
            {model.header.title}
          </h1>
          <p className="max-w-3xl leading-relaxed text-pretty text-muted-foreground">
            {model.header.description}
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlogList emptyState={model.emptyState} posts={model.cards} />
        </div>
      </section>
    </>
  );
}
