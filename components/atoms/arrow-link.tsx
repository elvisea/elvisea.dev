import Link from "next/link";
import type { ComponentProps } from "react";

import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { cn } from "cn";

const icons = {
  forward: ArrowRightIcon,
  back: ArrowLeftIcon,
  external: ArrowUpRightIcon,
};

interface ArrowLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  /**
   * `forward`: seta à direita (ver mais, abrir página);
   * `back`: seta à esquerda, antes do texto (voltar à lista);
   * `external`: seta diagonal, abre em nova aba.
   */
  direction?: keyof typeof icons;
  size?: "base" | "sm";
}

/** Link de texto com seta, com área de toque de 44 px. */
export function ArrowLink({
  href,
  direction = "forward",
  size = "base",
  className,
  children,
  ...props
}: ArrowLinkProps) {
  const Icon = icons[direction];
  const icon = <Icon aria-hidden className="size-4" />;
  const classes = cn(
    "inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline",
    size === "sm" && "text-sm",
    className,
  );

  if (direction === "external") {
    return (
      <a
        className={classes}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {direction === "back" ? icon : null}
      {children}
      {direction === "forward" ? icon : null}
    </Link>
  );
}
