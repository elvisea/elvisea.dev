/**
 * Fontes das imagens OG (`next/og`/satori). O satori aceita ttf/otf/woff,
 * não woff2, por isso as TTF do Geist ficam versionadas em `assets/fonts`
 * (licença SIL OFL em `assets/fonts/OFL.txt`).
 *
 * Só roda em build (as imagens OG são estáticas).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");

export async function loadOgFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(path.join(FONTS_DIR, "Geist-Regular.ttf")),
    readFile(path.join(FONTS_DIR, "Geist-SemiBold.ttf")),
  ]);
  return [
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: semibold,
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}
