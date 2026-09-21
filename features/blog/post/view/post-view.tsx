import { ArrowLink } from "@/components/atoms/arrow-link";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PostBody } from "@/components/organisms/post-body";
import { Separator } from "@/components/ui/separator";
import { PostToc } from "@/features/blog/components/molecules/post-toc";
import { PostHeader } from "@/features/blog/components/organisms/post-header";
import type { PostViewModel } from "@/features/blog/post/view-model/get-post-view-model";

/** Página de um post (`/blog/<slug>`). */
export function PostView({ model }: { model: PostViewModel }) {
  return (
    <article className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <PageJsonLd breadcrumb={model.breadcrumb} nodes={model.jsonLd} />
      <ArrowLink direction="back" href={model.back.href} size="sm">
        {model.back.label}
      </ArrowLink>
      <PostHeader header={model.header} />
      <PostToc items={model.toc.items} label={model.toc.label} />
      <PostBody html={model.html} />
      <footer className="space-y-6">
        <Separator />
        <ArrowLink direction="external" href={model.share.href} size="sm">
          {model.share.label}
        </ArrowLink>
      </footer>
    </article>
  );
}
