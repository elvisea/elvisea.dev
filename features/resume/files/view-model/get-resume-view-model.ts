/** View-model de `/curriculo`: cabeçalho e os PDFs disponíveis. */
import type { Metadata } from "next";

import { curriculoPage } from "@/content/pt-BR/pages/profissional";
import { RESUME_PATH } from "@/features/resume/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface ResumeFileModel {
  href: string;
  title: string;
  description: string;
  download: string;
}

export interface ResumeViewModel {
  header: typeof curriculoPage.header;
  files: readonly ResumeFileModel[];
  breadcrumb: readonly BreadcrumbItem[];
  metadata: Metadata;
}

export const resumeMetadata: Metadata = pageMetadata({
  title: curriculoPage.metaTitle,
  description: curriculoPage.metaDescription,
  path: RESUME_PATH,
});

export function getResumeViewModel(): ResumeViewModel {
  return {
    header: curriculoPage.header,
    files: curriculoPage.files.map((file) => ({
      href: file.href,
      title: file.title,
      description: file.description,
      download: curriculoPage.download,
    })),
    breadcrumb: [{ name: curriculoPage.metaTitle, path: RESUME_PATH }],
    metadata: resumeMetadata,
  };
}
