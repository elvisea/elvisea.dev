/**
 * View-model da home: junta o que cada feature expõe (perfil, stack,
 * serviços, experiência, projetos, blog e contato) no que a tela mostra.
 *
 * A home só conhece `repository/`, `domain/`, `routes.ts` e os componentes
 * das outras features — nunca os view-models delas.
 */
import type { Metadata } from "next";

import { blogPage } from "@/content/pt-BR/pages/blog";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { homePage, sobrePage } from "@/content/pt-BR/pages/profissional";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { site } from "@/content/pt-BR/site";
import {
  type ProfileModel,
  type StackGroupModel,
  toProfileModel,
  toStackGroups,
} from "@/features/about/domain/profile";
import { ABOUT_PATH } from "@/features/about/routes";
import {
  type PostCardModel,
  toPostCardModel,
} from "@/features/blog/domain/post-card";
import {
  blogRepository,
  type BlogRepository,
} from "@/features/blog/repository/blog-repository";
import { BLOG_PATH } from "@/features/blog/routes";
import { CONTACT_PATH } from "@/features/contact/routes";
import {
  type TimelineEntry,
  toTimelineEntries,
} from "@/features/experience/domain/timeline";
import {
  experienceRepository,
  type ExperienceRepository,
} from "@/features/experience/repository/experience-repository";
import { EXPERIENCE_PATH } from "@/features/experience/routes";
import {
  type ProjectCardModel,
  toProjectCardModel,
} from "@/features/projects/domain/project-card";
import {
  defaultProjectsRepository,
  type ProjectsRepository,
} from "@/features/projects/repository/projects-repository";
import { PROJECTS_PATH } from "@/features/projects/routes";
import {
  type ServiceCardModel,
  toServiceCardModel,
} from "@/features/services/domain/service-card";
import {
  servicesRepository,
  type ServicesRepository,
} from "@/features/services/repository/services-repository";
import { SERVICES_PATH } from "@/features/services/routes";
import {
  aboutRepository,
  type AboutRepository,
} from "@/features/about/repository/about-repository";
import { RESUME_PATH } from "@/features/resume/routes";
import { pageMetadata } from "@/lib/seo/metadata";

/** Projetos em destaque na home. */
const FEATURED_PROJECTS = 6;
/** Posts na prévia do blog. */
const RECENT_POSTS = 3;

export interface HeroAction {
  href: string;
  label: string;
  /** Abre em nova aba (LinkedIn, GitHub). */
  external?: boolean;
}

export interface HeroModel {
  location: string;
  name: string;
  role: string;
  stackLabel: string;
  stack: readonly string[];
  actions: readonly HeroAction[];
}

export interface SectionLink {
  href: string;
  label: string;
}

export interface HomeViewModel {
  hero: HeroModel;
  profile: {
    header: { eyebrow: string; title: string };
    model: ProfileModel;
    more: SectionLink;
  };
  services: {
    header: { eyebrow: string; title: string; description: string };
    cards: readonly ServiceCardModel[];
    cardMore: string;
    cardStackLabel: string;
    all: SectionLink;
  };
  experience: {
    header: { eyebrow: string; title: string };
    entries: readonly TimelineEntry[];
    more: SectionLink;
  };
  projects: {
    header: { eyebrow: string; title: string };
    cards: readonly ProjectCardModel[];
    more: SectionLink;
  };
  stack: {
    header: { eyebrow: string; title: string };
    groups: readonly StackGroupModel[];
  };
  blog: {
    header: { eyebrow: string; title: string };
    posts: readonly PostCardModel[];
    viewAll: SectionLink;
  };
  contact: {
    header: { eyebrow: string; title: string; description: string };
    cta: SectionLink;
  };
}

export const homeMetadata: Metadata = pageMetadata({ path: "/" });

interface HomeRepositories {
  about?: AboutRepository;
  experiences?: ExperienceRepository;
  services?: ServicesRepository;
  projects?: ProjectsRepository;
  blog?: BlogRepository;
}

export async function getHomeViewModel({
  about = aboutRepository,
  experiences = experienceRepository,
  services = servicesRepository,
  projects = defaultProjectsRepository(),
  blog = blogRepository,
}: HomeRepositories = {}): Promise<HomeViewModel> {
  const posts = await blog.recent(RECENT_POSTS);

  return {
    hero: {
      location: site.person.location,
      name: site.person.name,
      role: site.person.role,
      stackLabel: homePage.hero.stackLabel,
      stack: site.person.stack,
      actions: [
        { href: RESUME_PATH, label: homePage.hero.resume },
        { href: SERVICES_PATH, label: servicosPage.home.heroCta },
        { ...site.links.linkedin, external: true },
        { ...site.links.github, external: true },
      ],
    },
    profile: {
      header: {
        eyebrow: homePage.profile.eyebrow,
        title: homePage.profile.title,
      },
      model: toProfileModel(about.profile(), sobrePage.atuacao),
      more: { href: ABOUT_PATH, label: homePage.profile.more },
    },
    services: {
      header: servicosPage.home,
      cards: services
        .list()
        .map((service) => toServiceCardModel(service, about.stackItem)),
      cardMore: servicosPage.card.more,
      cardStackLabel: servicosPage.detail.stack,
      all: { href: SERVICES_PATH, label: servicosPage.home.all },
    },
    experience: {
      header: {
        eyebrow: homePage.experience.eyebrow,
        title: homePage.experience.title,
      },
      entries: toTimelineEntries(experiences.highlighted(), {
        full: false,
        stackItem: about.stackItem,
      }),
      more: { href: EXPERIENCE_PATH, label: homePage.experience.all },
    },
    projects: {
      header: {
        eyebrow: projetosPage.preview.eyebrow,
        title: projetosPage.preview.title,
      },
      cards: projects
        .featured(FEATURED_PROJECTS)
        .map((project) => toProjectCardModel(project, projetosPage.card)),
      more: { href: PROJECTS_PATH, label: projetosPage.preview.all },
    },
    stack: {
      header: { eyebrow: homePage.stack.eyebrow, title: homePage.stack.title },
      groups: toStackGroups(about.stackGroups()),
    },
    blog: {
      header: {
        eyebrow: blogPage.preview.eyebrow,
        title: blogPage.preview.title,
      },
      posts: posts.map((post) =>
        toPostCardModel(post, {
          readMore: blogPage.card.readMore,
          meta: blogPage.meta,
        }),
      ),
      viewAll: { href: BLOG_PATH, label: blogPage.preview.viewAll },
    },
    contact: {
      header: contatoPage.home,
      cta: { href: CONTACT_PATH, label: contatoPage.home.cta },
    },
  };
}
