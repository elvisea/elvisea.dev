import { FileTextIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { buttonVariants } from "@/components/ui/button";
import { curriculoPage } from "@/content/pt-BR/pages/profissional";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "cn";

export const metadata = pageMetadata({
  title: curriculoPage.metaTitle,
  description: curriculoPage.metaDescription,
  path: "/curriculo",
});

export default function CurriculoPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeader
        as="h1"
        description={curriculoPage.header.description}
        eyebrow={curriculoPage.header.eyebrow}
        title={curriculoPage.header.title}
      />
      <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
        {curriculoPage.files.map((file) => (
          <li
            key={file.href}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          >
            <FileTextIcon aria-hidden className="size-6 text-primary" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-heading">
                {file.title}
              </h2>
              <p className="text-pretty text-muted-foreground">
                {file.description}
              </p>
            </div>
            <a
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-auto h-11 w-full px-5 sm:w-auto sm:self-start",
              )}
              href={file.href}
              rel="noopener"
              target="_blank"
            >
              {curriculoPage.download}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
