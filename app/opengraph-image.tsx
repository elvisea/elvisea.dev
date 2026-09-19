import { ImageResponse } from "next/og";

import {
  OG_SIZE,
  OgCardTemplate,
} from "@/components/templates/og-card-template";
import { site } from "@/content/pt-BR/site";
import { loadOgFonts } from "@/lib/og/fonts";

export const alt = `${site.person.name} · ${site.person.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <OgCardTemplate
      author={site.person.fullName}
      domain={site.domain}
      eyebrow={site.person.role}
      subtitle={site.person.stack.join(" · ")}
      title={site.person.name}
    />,
    { ...size, fonts: await loadOgFonts() },
  );
}
