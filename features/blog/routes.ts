/** Rotas da feature de blog, usadas pelos view-models, pela home e pelo sitemap. */
export const BLOG_PATH = "/blog";

export function postPath(slug: string): string {
  return `${BLOG_PATH}/${slug}`;
}

/** Compartilhamento do post no LinkedIn (o card usa a imagem OG gerada). */
export function linkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}
