import type { ReactNode } from "react";

import {
  SectionHeader,
  type SectionHeaderContent,
} from "@/components/molecules/section-header";
import { cn } from "cn";

const widths = {
  /** Listas e grades (experiência, projetos, contato). */
  wide: "max-w-6xl",
  /** Página de detalhe com seções (serviço). */
  medium: "max-w-4xl",
  /** Texto corrido (post, estudo de caso, como trabalho). */
  narrow: "max-w-3xl",
};

interface PageTemplateProps {
  /** Cabeçalho com o `h1`. Sem ele, o conteúdo traz o próprio cabeçalho. */
  header?: SectionHeaderContent;
  width?: keyof typeof widths;
  /** Ajuste de espaçamento entre os blocos (padrão `space-y-12`). */
  className?: string;
  children: ReactNode;
}

/** Casco das páginas internas: largura, margens e cabeçalho com o `h1`. */
export function PageTemplate({
  header,
  width = "wide",
  className,
  children,
}: PageTemplateProps) {
  return (
    <div
      className={cn(
        "mx-auto space-y-12 px-4 py-16 sm:px-6 lg:py-20",
        widths[width],
        className,
      )}
    >
      {header ? <SectionHeader as="h1" {...header} /> : null}
      {children}
    </div>
  );
}
