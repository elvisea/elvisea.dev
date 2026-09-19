import type { ComponentProps } from "react";

import { cn } from "cn";

/** Rótulo curto acima de um título, em mono e na cor de destaque. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("font-mono text-sm text-highlight", className)}
      {...props}
    />
  );
}
