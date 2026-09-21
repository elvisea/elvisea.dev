/** View-model de `/experiencia`: linha do tempo completa, trilha e metadata. */
import type { Metadata } from "next";

import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import {
  aboutRepository,
  type AboutRepository,
} from "@/features/about/repository/about-repository";
import {
  type TimelineEntry,
  toTimelineEntries,
} from "@/features/experience/domain/timeline";
import {
  experienceRepository,
  type ExperienceRepository,
} from "@/features/experience/repository/experience-repository";
import { EXPERIENCE_PATH } from "@/features/experience/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export interface ExperienceViewModel {
  header: typeof experienciaPage.header;
  entries: readonly TimelineEntry[];
  breadcrumb: readonly BreadcrumbItem[];
  metadata: Metadata;
}

interface Repositories {
  experiences?: ExperienceRepository;
  about?: AboutRepository;
}

export function getExperienceViewModel(
  repositories: Repositories = {},
): ExperienceViewModel {
  return {
    header: experienciaPage.header,
    entries: toTimelineEntries(
      (repositories.experiences ?? experienceRepository).list(),
      {
        full: true,
        stackItem: (repositories.about ?? aboutRepository).stackItem,
      },
    ),
    breadcrumb: [{ name: experienciaPage.metaTitle, path: EXPERIENCE_PATH }],
    metadata: pageMetadata({
      title: experienciaPage.metaTitle,
      description: experienciaPage.metaDescription,
      path: EXPERIENCE_PATH,
    }),
  };
}
