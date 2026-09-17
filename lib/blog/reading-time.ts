/**
 * Tempo de leitura estimado, arredondado para cima, mínimo 1 minuto.
 * 200 palavras por minuto é a média usual para texto técnico em português.
 */
const WORDS_PER_MINUTE = 200;

export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
