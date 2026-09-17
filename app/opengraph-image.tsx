import { ImageResponse } from "next/og";

import { site } from "@/content/pt-BR/site";
import { OgCard, OG_SIZE } from "@/lib/og/card";
import { loadOgFonts } from "@/lib/og/fonts";

export const alt = `${site.person.name} · ${site.person.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <OgCard
      eyebrow={site.person.role}
      subtitle={site.person.stack.join(" · ")}
      title={site.person.name}
    />,
    { ...size, fonts: await loadOgFonts() },
  );
}
