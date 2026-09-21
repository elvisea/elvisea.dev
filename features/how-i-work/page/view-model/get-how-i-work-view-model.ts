/**
 * View-model de `/como-trabalho`: cabeçalho e o texto em Markdown
 * (`content/pt-BR/como-trabalho.md`), renderizado em build.
 */
import type { Metadata } from "next";

import { comoTrabalhoPage } from "@/content/pt-BR/pages/profissional";
import { HOW_I_WORK_PATH } from "@/features/how-i-work/routes";
import { renderContentPage } from "@/lib/content/markdown-page";
import { pageMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface HowIWorkViewModel {
  header: typeof comoTrabalhoPage.header;
  html: string;
  breadcrumb: readonly BreadcrumbItem[];
  metadata: Metadata;
}

export const howIWorkMetadata: Metadata = pageMetadata({
  title: comoTrabalhoPage.metaTitle,
  description: comoTrabalhoPage.metaDescription,
  path: HOW_I_WORK_PATH,
});

export async function getHowIWorkViewModel(
  renderPage: (name: string) => Promise<string> = renderContentPage,
): Promise<HowIWorkViewModel> {
  return {
    header: comoTrabalhoPage.header,
    html: await renderPage("como-trabalho"),
    breadcrumb: [{ name: comoTrabalhoPage.metaTitle, path: HOW_I_WORK_PATH }],
    metadata: howIWorkMetadata,
  };
}
