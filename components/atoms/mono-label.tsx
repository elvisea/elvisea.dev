import type { ComponentProps } from "react";

import { cn } from "cn";

type Tag = "h2" | "h3" | "h4" | "p" | "span";

interface MonoLabelProps extends ComponentProps<"p"> {
  /** Elemento renderizado; o nível de título depende de onde o rótulo entra. */
  as?: Tag;
}

/** Rótulo de grupo em mono, caixa alta e cor de destaque. */
export function MonoLabel({
  as: Tag = "p",
  className,
  ...props
}: MonoLabelProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-xs tracking-wide text-highlight uppercase",
        className,
      )}
      {...props}
    />
  );
}
