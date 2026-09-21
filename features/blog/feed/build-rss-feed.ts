/** Montagem do XML do feed RSS 2.0 (`/rss.xml`), sem tocar em I/O. */
import { escapeXml, rfc822 } from "./rss-xml";

export interface RssChannel {
  title: string;
  /** Link da página do blog. */
  link: string;
  description: string;
  language: string;
  /** URL do próprio feed (`atom:link rel="self"`). */
  self: string;
}

export interface RssItem {
  title: string;
  link: string;
  /** `YYYY-MM-DD`; vira data RFC 822 ao meio-dia UTC, para não trocar o dia. */
  date: string;
  description: string;
  categories: readonly string[];
}

function itemXml(item: RssItem): string {
  return [
    "    <item>",
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${item.link}</link>`,
    `      <guid isPermaLink="true">${item.link}</guid>`,
    `      <pubDate>${rfc822(item.date)}</pubDate>`,
    `      <description>${escapeXml(item.description)}</description>`,
    item.categories
      .map((tag) => `      <category>${escapeXml(tag)}</category>`)
      .join("\n"),
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildRssFeed(
  channel: RssChannel,
  items: readonly RssItem[],
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${channel.link}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${channel.language}</language>
    <atom:link href="${channel.self}" rel="self" type="application/rss+xml"/>
${items.map(itemXml).join("\n")}
  </channel>
</rss>
`;
}
