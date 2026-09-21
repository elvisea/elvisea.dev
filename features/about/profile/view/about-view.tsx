import Link from "next/link";

import { ArrowLink } from "@/components/atoms/arrow-link";
import { MonoLabel } from "@/components/atoms/mono-label";
import { PageJsonLd } from "@/components/molecules/page-json-ld";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageTemplate } from "@/components/templates/page-template";
import { buttonVariants } from "@/components/ui/button";
import { CertificateList } from "@/features/about/components/organisms/certificate-list";
import { EducationList } from "@/features/about/components/organisms/education-list";
import { ProfileSummary } from "@/features/about/components/organisms/profile-summary";
import { StackGrid } from "@/features/about/components/organisms/stack-grid";
import type { AboutViewModel } from "@/features/about/profile/view-model/get-about-view-model";
import { cn } from "cn";

/** Página "Sobre" (`/sobre`): perfil, stack, formação e certificados. */
export function AboutView({ model }: { model: AboutViewModel }) {
  return (
    <>
      <PageJsonLd breadcrumb={model.breadcrumb} nodes={model.jsonLd} />
      <PageTemplate className="space-y-20">
        <section className="space-y-10">
          <SectionHeader as="h1" {...model.header} />
          <ProfileSummary headingLevel="h2" profile={model.profile} />
          <div className="max-w-3xl space-y-3">
            <MonoLabel as="h2">{model.aiEngineering.title}</MonoLabel>
            <p className="text-pretty text-foreground">
              {model.aiEngineering.text}
            </p>
            <ArrowLink href={model.aiEngineering.link.href}>
              {model.aiEngineering.link.label}
            </ArrowLink>
          </div>
          <Link
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            href={model.resumeLink.href}
          >
            {model.resumeLink.label}
          </Link>
        </section>

        <section className="scroll-mt-20 space-y-8" id="stack">
          <SectionHeader {...model.stack.header} />
          <StackGrid groups={model.stack.groups} />
        </section>

        <section className="scroll-mt-20 space-y-8" id="formacao">
          <SectionHeader {...model.education.header} />
          <EducationList items={model.education.items} />
        </section>

        <section className="scroll-mt-20 space-y-8" id="certificados">
          <SectionHeader
            eyebrow={model.certificates.header.eyebrow}
            title={model.certificates.header.title}
          />
          <CertificateList
            items={model.certificates.items}
            viewLabel={model.certificates.viewLabel}
          />
        </section>
      </PageTemplate>
    </>
  );
}
