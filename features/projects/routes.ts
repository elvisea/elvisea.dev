/** Rotas da feature de projetos, usadas pelos view-models, pela home e pelo sitemap. */
export const PROJECTS_PATH = "/projetos";

/** Página do estudo de caso de um projeto. */
export function projectPath(slug: string): string {
  return `${PROJECTS_PATH}/${slug}`;
}
