import { SectionHeader } from "@/components/molecules/section-header";
import { PostBody } from "@/components/organisms/post-body";
import { comoTrabalhoPage } from "@/content/pt-BR/pages/profissional";
import { renderContentPage } from "@/lib/content/markdown-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: comoTrabalhoPage.metaTitle,
  description: comoTrabalhoPage.metaDescription,
  path: "/como-trabalho",
});

export default async function ComoTrabalhoPage() {
  const html = await renderContentPage("como-trabalho");

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeader
        as="h1"
        description={comoTrabalhoPage.header.description}
        eyebrow={comoTrabalhoPage.header.eyebrow}
        title={comoTrabalhoPage.header.title}
      />
      <PostBody html={html} />
    </div>
  );
}
