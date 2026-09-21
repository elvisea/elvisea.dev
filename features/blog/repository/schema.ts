/**
 * Contrato do frontmatter dos posts (`content/pt-BR/blog/posts/*.md`).
 *
 * Validado em build por `features/blog/repository/source.ts`: frontmatter inválido faz o
 * build falhar com a mensagem `Invalid frontmatter in "<arquivo>.md": …`.
 *
 * `.strict()`: campo desconhecido (ou com erro de digitação) também falha.
 * O autor não fica no frontmatter: é sempre `site.person`.
 *
 * @module features/blog/repository/schema
 */
import { z } from "zod";

/** `YYYY-MM-DD` quoted no YAML, ou `Date` que o gray-matter gera sem aspas. */
const DateField = z.union([
  z.iso.date(),
  z.date().transform((d) => d.toISOString().slice(0, 10)),
]);

export const PostFrontmatterSchema = z
  .object({
    /** Até 90 caracteres: cabe no título da aba e no card do LinkedIn. */
    title: z.string().min(1).max(90),
    /** 50 a 160 caracteres: meta description e prévia do link. */
    description: z.string().min(50).max(160),
    date: DateField,
    updated: DateField.optional(),
    tags: z.array(z.string().min(1)).max(4).default([]),
    draft: z.boolean().default(false),
    /** Sem capa, a imagem OG gerada é usada. */
    coverImage: z.string().optional(),
  })
  .strict();

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/** Post carregado da fonte; `raw` é o Markdown sem o frontmatter. */
export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  raw: string;
};

/** Post sem o corpo, para listas e metadados. */
export type PostSummary = Omit<Post, "raw"> & {
  readingMinutes: number;
};
