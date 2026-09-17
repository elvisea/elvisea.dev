import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import {
  CertificateList,
  EducationList,
} from "@/components/organisms/credentials";
import { ProfileSummary } from "@/components/organisms/profile-summary";
import { StackGrid } from "@/components/organisms/stack-grid";
import { buttonVariants } from "@/components/ui/button";
import { perfil } from "@/content/pt-BR/perfil";
import { sobrePage } from "@/content/pt-BR/pages/profissional";
import { PageJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { profilePageNode } from "@/lib/seo/structured-data";
import { cn } from "cn";

export const metadata = pageMetadata({
  title: sobrePage.metaTitle,
  description: sobrePage.metaDescription,
  path: "/sobre",
});

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:py-20">
      <PageJsonLd
        breadcrumb={[{ name: sobrePage.metaTitle, path: "/sobre" }]}
        nodes={[
          profilePageNode({ name: sobrePage.header.title, path: "/sobre" }),
        ]}
      />
      <section className="space-y-10">
        <SectionHeader
          as="h1"
          eyebrow={sobrePage.header.eyebrow}
          title={sobrePage.header.title}
        />
        <ProfileSummary atuacaoTitle={sobrePage.atuacao} headingLevel="h2" />
        <div className="max-w-3xl space-y-3">
          <h2 className="font-mono text-xs tracking-wide text-highlight uppercase">
            {sobrePage.engenhariaComIa.title}
          </h2>
          <p className="text-pretty text-foreground">
            {perfil.engenhariaComIa}
          </p>
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
            href="/como-trabalho"
          >
            {sobrePage.engenhariaComIa.link}
            <ArrowRightIcon aria-hidden className="size-4" />
          </Link>
        </div>
        <Link
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          href="/curriculo"
        >
          {sobrePage.curriculo}
        </Link>
      </section>

      <section className="scroll-mt-20 space-y-8" id="stack">
        <SectionHeader
          eyebrow={sobrePage.stack.eyebrow}
          title={sobrePage.stack.title}
        />
        <StackGrid />
      </section>

      <section className="scroll-mt-20 space-y-8" id="formacao">
        <SectionHeader
          eyebrow={sobrePage.formacao.eyebrow}
          title={sobrePage.formacao.title}
        />
        <EducationList />
      </section>

      <section className="scroll-mt-20 space-y-8" id="certificados">
        <SectionHeader
          eyebrow={sobrePage.certificados.eyebrow}
          title={sobrePage.certificados.title}
        />
        <CertificateList />
      </section>
    </div>
  );
}
