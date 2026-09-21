/** Rotas da feature de experiência. */
export const EXPERIENCE_PATH = "/experiencia";

/** Âncora de uma experiência na página completa (usada pela home). */
export function experienceAnchor(slug: string): string {
  return `${EXPERIENCE_PATH}#${slug}`;
}
