import { FileTextIcon } from "lucide-react";

import { SectionHeader } from "@/components/molecules/section-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { curriculoPage } from "@/content/pt-BR/pages/profissional";
import { PageJsonLd } from "@/lib/seo/json-ld";
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
      <PageJsonLd
        breadcrumb={[{ name: curriculoPage.metaTitle, path: "/curriculo" }]}
      />
      <SectionHeader
        as="h1"
        description={curriculoPage.header.description}
        eyebrow={curriculoPage.header.eyebrow}
        title={curriculoPage.header.title}
      />
      <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
        {curriculoPage.files.map((file) => (
          <li key={file.href}>
            <Card className="h-full">
              <CardHeader className="gap-3">
                <FileTextIcon aria-hidden className="size-6 text-primary" />
                <CardTitle className="text-lg font-semibold text-heading">
                  <h2>{file.title}</h2>
                </CardTitle>
                <CardDescription className="text-base text-pretty">
                  {file.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <a
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full px-5 sm:w-auto",
                  )}
                  href={file.href}
                  rel="noopener"
                  target="_blank"
                >
                  {curriculoPage.download}
                </a>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
