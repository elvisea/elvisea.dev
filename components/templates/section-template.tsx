import type { ReactNode } from "react";

import {
  SectionHeader,
  type SectionHeaderContent,
} from "@/components/molecules/section-header";
import { cn } from "cn";

interface SectionTemplateProps {
  /** Âncora da seção (`/#servicos`). */
  id?: string;
  header: SectionHeaderContent;
  /** Fundo `surface`, para alternar as seções da home. */
  surface?: boolean;
  children: ReactNode;
}

/** Casco das seções da home: faixa com borda, largura e cabeçalho `h2`. */
export function SectionTemplate({
  id,
  header,
  surface = false,
  children,
}: SectionTemplateProps) {
  return (
    <section
      className={cn(
        "scroll-mt-20 border-b border-border py-20",
        surface && "bg-surface",
      )}
      id={id}
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <SectionHeader {...header} />
        {children}
      </div>
    </section>
  );
}
