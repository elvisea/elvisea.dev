import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { HeroSection } from "@/components/organisms/hero-section";
import { buttonVariants } from "@/components/ui/button";
import { blogPage } from "@/content/pt-BR/pages/blog";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { homePage } from "@/content/pt-BR/pages/profissional";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { ProfileSummary } from "@/features/about/components/organisms/profile-summary";
import { StackGrid } from "@/features/about/components/organisms/stack-grid";
import {
  getProfileModel,
  getStackGroups,
} from "@/features/about/profile/view-model/get-about-view-model";
import { BlogPreviewSection } from "@/features/blog/components/organisms/blog-preview-section";
import { toPostCardModel } from "@/features/blog/domain/post-card";
import { blogRepository } from "@/features/blog/repository/blog-repository";
import { BLOG_PATH } from "@/features/blog/routes";
import { ExperienceTimeline } from "@/features/experience/components/organisms/experience-timeline";
import { getTimelineEntries } from "@/features/experience/timeline/view-model/get-experience-view-model";
import { ProjectCard } from "@/features/projects/components/molecules/project-card";
import { toProjectCardModel } from "@/features/projects/domain/project-card";
import { defaultProjectsRepository } from "@/features/projects/repository/projects-repository";
import { getServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServicesSection } from "@/features/services/components/organisms/services-section";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "cn";

export const metadata = pageMetadata({ path: "/" });

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
      href={href}
    >
      {label}
      <ArrowRightIcon aria-hidden className="size-4" />
    </Link>
  );
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />

      <section
        className="scroll-mt-20 border-b border-border py-20"
        id="perfil"
      >
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={homePage.profile.eyebrow}
            title={homePage.profile.title}
          />
          <ProfileSummary profile={getProfileModel()} />
          <MoreLink href="/sobre" label={homePage.profile.more} />
        </div>
      </section>

      <ServicesSection
        allLabel={servicosPage.home.all}
        description={servicosPage.home.description}
        eyebrow={servicosPage.home.eyebrow}
        model={getServicesCatalogViewModel()}
        title={servicosPage.home.title}
      />

      <section
        className="scroll-mt-20 border-b border-border py-20"
        id="experiencia"
      >
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={homePage.experience.eyebrow}
            title={homePage.experience.title}
          />
          <div className="max-w-3xl">
            <ExperienceTimeline entries={getTimelineEntries(false)} />
          </div>
          <MoreLink href="/experiencia" label={homePage.experience.all} />
        </div>
      </section>

      <section
        className="scroll-mt-20 border-b border-border bg-surface py-20"
        id="projetos"
      >
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={projetosPage.preview.eyebrow}
            title={projetosPage.preview.title}
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {defaultProjectsRepository()
              .featured(6)
              .map((project) => (
                <li key={project.slug}>
                  <ProjectCard
                    project={toProjectCardModel(project, projetosPage.card)}
                  />
                </li>
              ))}
          </ul>
          <MoreLink href="/projetos" label={projetosPage.preview.all} />
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-border py-20" id="stack">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={homePage.stack.eyebrow}
            title={homePage.stack.title}
          />
          <StackGrid groups={getStackGroups()} />
        </div>
      </section>

      <BlogPreviewSection
        eyebrow={blogPage.preview.eyebrow}
        posts={(await blogRepository.recent(3)).map((post) =>
          toPostCardModel(post, {
            readMore: blogPage.card.readMore,
            meta: blogPage.meta,
          }),
        )}
        title={blogPage.preview.title}
        viewAll={{ href: BLOG_PATH, label: blogPage.preview.viewAll }}
      />

      <section className="scroll-mt-20 bg-surface py-20" id="contato">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            description={contatoPage.home.description}
            eyebrow={contatoPage.home.eyebrow}
            title={contatoPage.home.title}
          />
          <Link
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
            href="/contato"
          >
            {contatoPage.home.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
