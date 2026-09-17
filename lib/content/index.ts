/**
 * Consultas sobre o conteúdo profissional, usadas por páginas e organismos.
 */
import { certificados } from "@/content/pt-BR/certificados";
import { experiencias } from "@/content/pt-BR/experiencias";
import { stack } from "@/content/pt-BR/stack";

import type { Certificate, Experience, StackItem } from "./types";

const stackItems = new Map<string, StackItem>(
  stack.flatMap((group) => group.items.map((item) => [item.key, item])),
);

export function getStackItem(key: string): StackItem | undefined {
  return stackItems.get(key);
}

export function getExperiences(): readonly Experience[] {
  return experiencias;
}

export function getHighlightedExperiences(): readonly Experience[] {
  return experiencias.filter(
    (e: Experience) => "highlight" in e && e.highlight === true,
  );
}

/** Certificados visíveis: com data primeiro (mais recente antes), depois sem data. */
export function getVisibleCertificates(): Certificate[] {
  return certificados
    .filter((c: Certificate) => c.visible)
    .sort((a: Certificate, b: Certificate) => {
      if (a.issued && b.issued) return b.issued.localeCompare(a.issued);
      if (a.issued) return -1;
      if (b.issued) return 1;
      return 0;
    });
}
