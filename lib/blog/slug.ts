/**
 * Derivação e validação de slugs a partir do nome do arquivo `.md`.
 *
 * O slug é a URL pública do post (`/blog/<slug>`), então restringimos
 * a ASCII lowercase + dígitos + hífens simples. Renomear um arquivo
 * **muda a URL pública** — evite após a publicação para não quebrar
 * links indexados.
 *
 * @module lib/blog/slug
 */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * `true` se o slug bate `^[a-z0-9]+(-[a-z0-9]+)*$` (sem maiúsculas,
 * acentos, espaços, hífens nas pontas ou duplicados).
 */
export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

/**
 * Remove a extensão `.md` (case-insensitive) e valida o slug resultante.
 * Lança `Error` descritivo em filenames inválidos — falha cedo no build,
 * antes de gerar URLs malformadas.
 */
export function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  if (!isValidSlug(base)) {
    throw new Error(
      `Invalid blog post filename: "${filename}". ` +
        "Expected lowercase ASCII letters, digits and single hyphens (e.g. meu-post.md).",
    );
  }
  return base;
}
