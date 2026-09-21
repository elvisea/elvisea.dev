import Link from "next/link";

import { ArrowLink } from "@/components/atoms/arrow-link";
import { SectionHeader } from "@/components/molecules/section-header";
import { SectionTemplate } from "@/components/templates/section-template";
import { buttonVariants } from "@/components/ui/button";
import { ProfileSummary } from "@/features/about/components/organisms/profile-summary";
import { StackGrid } from "@/features/about/components/organisms/stack-grid";
import { BlogPreviewSection } from "@/features/blog/components/organisms/blog-preview-section";
import { ExperienceTimeline } from "@/features/experience/components/organisms/experience-timeline";
import { HeroSection } from "@/features/home/components/organisms/hero-section";
import type { HomeViewModel } from "@/features/home/home/view-model/get-home-view-model";
import { ProjectCard } from "@/features/projects/components/molecules/project-card";
import { ServicesSection } from "@/features/services/components/organisms/services-section";
import { cn } from "cn";

/** Página inicial: hero e uma seção por área do site. */
export function HomeView({ model }: { model: HomeViewModel }) {
  return (
    <>
      <HeroSection model={model.hero} />

      <SectionTemplate header={model.profile.header} id="perfil">
        <ProfileSummary profile={model.profile.model} />
        <ArrowLink href={model.profile.more.href}>
          {model.profile.more.label}
        </ArrowLink>
      </SectionTemplate>

      <ServicesSection
        all={model.services.all}
        cardMore={model.services.cardMore}
        cardStackLabel={model.services.cardStackLabel}
        cards={model.services.cards}
        description={model.services.header.description}
        eyebrow={model.services.header.eyebrow}
        title={model.services.header.title}
      />

      <SectionTemplate header={model.experience.header} id="experiencia">
        <div className="max-w-3xl">
          <ExperienceTimeline entries={model.experience.entries} />
        </div>
        <ArrowLink href={model.experience.more.href}>
          {model.experience.more.label}
        </ArrowLink>
      </SectionTemplate>

      <SectionTemplate header={model.projects.header} id="projetos" surface>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {model.projects.cards.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        <ArrowLink href={model.projects.more.href}>
          {model.projects.more.label}
        </ArrowLink>
      </SectionTemplate>

      <SectionTemplate header={model.stack.header} id="stack">
        <StackGrid groups={model.stack.groups} />
      </SectionTemplate>

      <BlogPreviewSection
        eyebrow={model.blog.header.eyebrow}
        posts={model.blog.posts}
        title={model.blog.header.title}
        viewAll={model.blog.viewAll}
      />

      <section className="scroll-mt-20 bg-surface py-20" id="contato">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader {...model.contact.header} />
          <Link
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
            href={model.contact.cta.href}
          >
            {model.contact.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
