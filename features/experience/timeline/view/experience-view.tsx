import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PageTemplate } from "@/components/templates/page-template";
import { ExperienceTimeline } from "@/features/experience/components/organisms/experience-timeline";
import type { ExperienceViewModel } from "@/features/experience/timeline/view-model/get-experience-view-model";

/** Página de experiência profissional (`/experiencia`). */
export function ExperienceView({ model }: { model: ExperienceViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate header={model.header}>
        <div className="max-w-3xl">
          <ExperienceTimeline entries={model.entries} />
        </div>
      </PageTemplate>
    </>
  );
}
