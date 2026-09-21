/**
 * Camada de **fonte** dos posts: lê arquivos `.md` do filesystem,
 * separa frontmatter (`gray-matter`) do corpo markdown e valida o
 * frontmatter contra o schema zod em `./schema.ts`.
 *
 * Esta é a única peça do sistema que toca filesystem. Substituí-la por
 * uma fonte alternativa (Postgres, CMS headless) requer apenas reescrever
 * `loadAllPostsFromFs` — a fachada cacheada (`./index.ts`), as rotas e os
 * componentes não mudam.
 *
 * Marcado `server-only` para que `node:fs` nunca vaze para o bundle do client.
 *
 * @module lib/blog/source
 */
import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { PostFrontmatterSchema, type Post } from "./schema";
import { slugFromFilename } from "./slug";

/**
 * Caminho absoluto da pasta dos posts. Resolve via `process.cwd()` para
 * funcionar tanto em dev quanto em build (o standalone copia `content/`
 * via `outputFileTracingIncludes` no `next.config.ts`).
 */
export const POSTS_DIR = path.join(
  process.cwd(),
  "content",
  "pt-BR",
  "blog",
  "posts",
);

/**
 * Lê todos os `.md` de um diretório, valida frontmatter e devolve os
 * posts ordenados por `date` desc (mais recente primeiro).
 *
 * Comportamento:
 * - Diretório inexistente → retorna `[]` (não falha o build).
 * - Arquivos não-`.md` → ignorados silenciosamente.
 * - Frontmatter inválido → lança `Error` com mensagem descritiva.
 *
 * Exposto separadamente de `loadAllPostsFromFs` para facilitar testes
 * com fixtures num tmpdir (ver `source.test.ts`).
 */
export async function loadPostsFromDir(dir: string): Promise<Post[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const files = entries.filter((file) => file.toLowerCase().endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = slugFromFilename(file);
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      const result = PostFrontmatterSchema.safeParse(parsed.data);
      if (!result.success) {
        const issues = result.error.issues
          .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("; ");
        throw new Error(`Invalid frontmatter in "${file}": ${issues}`);
      }
      return {
        slug,
        frontmatter: result.data,
        raw: parsed.content,
      } satisfies Post;
    }),
  );

  return posts.sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );
}

/**
 * Atalho que aplica `loadPostsFromDir` ao `POSTS_DIR` padrão.
 * Consumido pela fachada cacheada em `./index.ts` — não chame direto
 * em rotas ou componentes (perde o cache do React).
 */
export const loadAllPostsFromFs = (): Promise<Post[]> =>
  loadPostsFromDir(POSTS_DIR);
