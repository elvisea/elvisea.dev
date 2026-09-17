import { BlogPreviewSection } from "@/components/organisms/blog-preview-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BlogPreviewSection />
    </>
  );
}
