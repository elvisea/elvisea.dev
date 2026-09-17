/**
 * Feed RSS 2.0 em `/rss.xml`, gerado em build com os posts publicados.
 */
import { blogPage } from "@/content/pt-BR/pages/blog";
import { site } from "@/content/pt-BR/site";
import { getAllPosts } from "@/lib/blog";
import { escapeXml, rfc822 } from "@/lib/blog/rss";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      const categories = post.frontmatter.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(post.frontmatter.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(post.frontmatter.date)}</pubDate>`,
        `      <description>${escapeXml(post.frontmatter.description)}</description>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(blogPage.rss.title)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml(blogPage.metaDescription)}</description>
    <language>pt-BR</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
