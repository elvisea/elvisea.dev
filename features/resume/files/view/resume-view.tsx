import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { PageTemplate } from "@/components/templates/page-template";
import { ResumeFileCard } from "@/features/resume/components/molecules/resume-file-card";
import type { ResumeViewModel } from "@/features/resume/files/view-model/get-resume-view-model";

/** Página de currículo (`/curriculo`): PDFs para download. */
export function ResumeView({ model }: { model: ResumeViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} />
      <PageTemplate header={model.header}>
        <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
          {model.files.map((file) => (
            <li key={file.href}>
              <ResumeFileCard file={file} />
            </li>
          ))}
        </ul>
      </PageTemplate>
    </>
  );
}
