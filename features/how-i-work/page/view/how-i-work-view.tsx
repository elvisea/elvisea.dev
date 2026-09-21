import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PostBody } from "@/components/organisms/post-body";
import { PageTemplate } from "@/components/templates/page-template";
import type { HowIWorkViewModel } from "@/features/how-i-work/page/view-model/get-how-i-work-view-model";

/** Página "Como trabalho" (`/como-trabalho`): texto corrido em Markdown. */
export function HowIWorkView({ model }: { model: HowIWorkViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate className="space-y-10" header={model.header} width="narrow">
        <PostBody html={model.html} />
      </PageTemplate>
    </>
  );
}
