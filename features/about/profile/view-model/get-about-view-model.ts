/**
 * View-model de `/sobre`: perfil, engenharia com IA, stack, formação e
 * certificados, mais trilha, JSON-LD e metadata.
 */
import type { Metadata } from "next";

import { sobrePage } from "@/content/pt-BR/pages/profissional";
import { ABOUT_PATH } from "@/features/about/routes";
import {
  type CertificateModel,
  type EducationModel,
  toCertificateModel,
  toEducationModel,
} from "@/features/about/domain/credentials";
import {
  type ProfileModel,
  type StackGroupModel,
  toProfileModel,
  toStackGroups,
} from "@/features/about/domain/profile";
import {
  aboutRepository,
  type AboutRepository,
} from "@/features/about/repository/about-repository";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  type BreadcrumbItem,
  type JsonLdNode,
  profilePageNode,
} from "@/lib/seo/structured-data";

export type { ProfileModel, StackGroupModel };

export interface AboutViewModel {
  header: typeof sobrePage.header;
  profile: ProfileModel;
  aiEngineering: {
    title: string;
    text: string;
    link: { href: string; label: string };
  };
  resumeLink: { href: string; label: string };
  stack: { header: typeof sobrePage.stack; groups: readonly StackGroupModel[] };
  education: {
    header: typeof sobrePage.formacao;
    items: readonly EducationModel[];
  };
  certificates: {
    header: typeof sobrePage.certificados;
    viewLabel: string;
    items: readonly CertificateModel[];
  };
  breadcrumb: readonly BreadcrumbItem[];
  jsonLd: readonly JsonLdNode[];
  metadata: Metadata;
}

export function getAboutViewModel(
  repository: AboutRepository = aboutRepository,
): AboutViewModel {
  return {
    header: sobrePage.header,
    profile: toProfileModel(repository.profile(), sobrePage.atuacao),
    aiEngineering: {
      title: sobrePage.engenhariaComIa.title,
      text: repository.profile().engenhariaComIa,
      link: { href: "/como-trabalho", label: sobrePage.engenhariaComIa.link },
    },
    resumeLink: { href: "/curriculo", label: sobrePage.curriculo },
    stack: {
      header: sobrePage.stack,
      groups: toStackGroups(repository.stackGroups()),
    },
    education: {
      header: sobrePage.formacao,
      items: repository.education().map(toEducationModel),
    },
    certificates: {
      header: sobrePage.certificados,
      viewLabel: sobrePage.certificados.view,
      items: repository
        .certificates()
        .map((certificate) =>
          toCertificateModel(certificate, sobrePage.certificados.noDate),
        ),
    },
    breadcrumb: [{ name: sobrePage.metaTitle, path: ABOUT_PATH }],
    jsonLd: [
      profilePageNode({ name: sobrePage.header.title, path: ABOUT_PATH }),
    ],
    metadata: pageMetadata({
      title: sobrePage.metaTitle,
      description: sobrePage.metaDescription,
      path: ABOUT_PATH,
    }),
  };
}
