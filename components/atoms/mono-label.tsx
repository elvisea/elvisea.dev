import type { ComponentProps } from "react";

import { cn } from "cn";

type Tag = "h2" | "h3" | "h4" | "p" | "span";

interface MonoLabelProps extends ComponentProps<"p"> {
  /** Elemento renderizado; o nível de título depende de onde o rótulo entra. */
  as?: Tag;
}

/**
 * Rótulo de grupo em mono, caixa alta e cor de destaque. `leading-4` fixa a
 * altura da linha do `text-xs` mesmo dentro de um `CardTitle`, que define
 * outra altura de linha.
 */
export function MonoLabel({
  as: Tag = "p",
  className,
  ...props
}: MonoLabelProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-xs leading-4 tracking-wide text-highlight uppercase",
        className,
      )}
      {...props}
    />
  );
}
