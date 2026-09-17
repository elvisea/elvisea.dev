import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { BlogPreviewSection } from "@/components/organisms/blog-preview-section";
import { ProjectCard } from "@/components/molecules/project-card";
import { ExperienceTimeline } from "@/components/organisms/experience-timeline";
import { HeroSection } from "@/components/organisms/hero-section";
import { ProfileSummary } from "@/components/organisms/profile-summary";
import { StackGrid } from "@/components/organisms/stack-grid";
import { buttonVariants } from "@/components/ui/button";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { homePage, sobrePage } from "@/content/pt-BR/pages/profissional";
import { projetosPage } from "@/content/pt-BR/pages/projetos";
import { getServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";
import { ServicesSection } from "@/features/services/components/organisms/services-section";
import { getHighlightedExperiences } from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects";
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

export default function HomePage() {
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
          <ProfileSummary atuacaoTitle={sobrePage.atuacao} />
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
            <ExperienceTimeline
              experiences={getHighlightedExperiences()}
              variant="compact"
            />
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
            {getFeaturedProjects(6).map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
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
          <StackGrid />
        </div>
      </section>

      <BlogPreviewSection />

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
