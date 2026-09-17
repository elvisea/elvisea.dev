import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { BlogPreviewSection } from "@/components/organisms/blog-preview-section";
import { ExperienceTimeline } from "@/components/organisms/experience-timeline";
import { HeroSection } from "@/components/organisms/hero-section";
import { ProfileSummary } from "@/components/organisms/profile-summary";
import { StackGrid } from "@/components/organisms/stack-grid";
import { homePage, sobrePage } from "@/content/pt-BR/pages/profissional";
import { getHighlightedExperiences } from "@/lib/content";
import { JsonLd, personJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

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
      <JsonLd data={personJsonLd()} />
      <HeroSection />

      <section className="border-b border-border py-20" id="perfil">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={homePage.profile.eyebrow}
            title={homePage.profile.title}
          />
          <ProfileSummary atuacaoTitle={sobrePage.atuacao} />
          <MoreLink href="/sobre" label={homePage.profile.more} />
        </div>
      </section>

      <section
        className="border-b border-border bg-surface py-20"
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

      <section className="border-b border-border py-20" id="stack">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <SectionHeader
            eyebrow={homePage.stack.eyebrow}
            title={homePage.stack.title}
          />
          <StackGrid />
        </div>
      </section>

      <BlogPreviewSection />
    </>
  );
}
