/** Feed RSS 2.0 em `/rss.xml`, gerado em build com os posts publicados. */
import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import { buildRssFeed } from "@/features/blog/feed/build-rss-feed";
import { blogRepository } from "@/features/blog/repository/blog-repository";
import { BLOG_PATH, postPath } from "@/features/blog/routes";

export const dynamic = "force-static";

export async function GET() {
  const posts = await blogRepository.list();
  const xml = buildRssFeed(
    {
      title: blogPage.rss.title,
      link: `${site.url}${BLOG_PATH}`,
      description: blogPage.metaDescription,
      language: site.language,
      self: `${site.url}/rss.xml`,
    },
    posts.map((post) => ({
      title: post.frontmatter.title,
      link: `${site.url}${postPath(post.slug)}`,
      date: post.frontmatter.date,
      description: post.frontmatter.description,
      categories: post.frontmatter.tags,
    })),
  );

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
