/**
 * `/robots.txt`: libera o site para buscadores e assistentes, e barra só os
 * crawlers de treinamento de modelo. A lista e o porquê estão em
 * `lib/seo/robots.ts`.
 */
import type { MetadataRoute } from "next";

import { site } from "@/content/pt-BR/site";
import { buildRobotsRules } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: buildRobotsRules(),
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
