/**
 * Contrato do frontmatter dos posts (`content/pt-BR/blog/posts/*.md`)
 * e tipos consumidos pelas rotas/componentes do blog.
 *
 * O schema é validado em build-time por `lib/blog/source.ts`. Frontmatter
 * inválido faz `bun --bun next build` falhar com mensagem descritiva
 * (`Invalid frontmatter in "<arquivo>.md": <campo>: <motivo>`).
 *
 * @module lib/blog/schema
 */
import { z } from "zod";

import { site } from "@/content/pt-BR/site";

/**
 * Frontmatter aceito em cada post. Defaults aplicados quando o campo
 * está ausente: `author = site.person.name`, `tags = []`, `draft = false`.
 *
 * `date` aceita string ISO `YYYY-MM-DD` (quoted no YAML) e também o tipo
 * `Date` que `gray-matter` produz quando o YAML traz a data não-quoted —
 * normalizado para string `YYYY-MM-DD` nesta segunda forma.
 */
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.union([
    z.iso.date(),
    z.date().transform((d) => d.toISOString().slice(0, 10)),
  ]),
  author: z.string().default(site.person.name),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  draft: z.boolean().default(false),
});

/** Tipo TS do frontmatter validado (resultado do parse zod). */
export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/**
 * Post completo carregado da fonte. `raw` é o markdown ainda **não**
 * renderizado — é responsabilidade da rota chamar `renderMarkdown` em
 * `lib/blog/markdown.ts` antes de exibir.
 */
export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  raw: string;
};

/**
 * Versão "leve" do post para listas/preview, sem o corpo markdown.
 * Usado por `BlogList`, `BlogPreviewSection` e `PostCard`.
 */
export type PostSummary = Omit<Post, "raw">;
