/**
 * Prepara a divulgação de um post no LinkedIn.
 *
 *   bun run teaser <slug>
 *
 * O script do package.json roda com `--conditions=react-server` porque o
 * loader dos posts importa `server-only`, que sem essa condição lança erro.
 *
 * Imprime título, descrição e a URL canônica com UTM. A prévia do post em si
 * é escrita à mão (texto canônico em presenca-digital/conteudo). O LinkedIn
 * reduz o alcance de posts com link no corpo, então o link vai no primeiro
 * comentário. O card do link usa a imagem OG gerada para o post.
 */
import { site } from "../content/pt-BR/site";
import { blogRepository } from "../features/blog/repository/blog-repository";

export function teaserUrl(slug: string): string {
  const params = new URLSearchParams({
    utm_source: "linkedin",
    utm_medium: "social",
    utm_campaign: slug,
  });
  return `${site.url}/blog/${slug}?${params.toString()}`;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Uso: bun run teaser <slug>");
    process.exit(1);
  }

  const post = (await blogRepository.listAll()).find((p) => p.slug === slug);
  if (!post) {
    console.error(`Post "${slug}" não encontrado em content/pt-BR/blog/posts.`);
    process.exit(1);
  }
  if (post.frontmatter.draft) {
    console.error(`Post "${slug}" ainda é draft: publique antes de divulgar.`);
    process.exit(1);
  }

  console.log(
    [
      `Título:     ${post.frontmatter.title}`,
      `Descrição:  ${post.frontmatter.description}`,
      "",
      `Link (1º comentário): ${teaserUrl(slug)}`,
      `Imagem do card:       ${site.url}/blog/${slug}/opengraph-image`,
      "",
      "Antes de postar: conferir a prévia em https://www.linkedin.com/post-inspector/",
    ].join("\n"),
  );
}

if (import.meta.main) {
  await main();
}
