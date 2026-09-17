import { techIcons } from "@/lib/content/icons";
import { cn } from "cn";

interface TechIconProps {
  /** Nome do export em `simple-icons` (ex.: `siReact`). */
  name?: string;
  className?: string;
}

/** Ícone monocromático (`currentColor`), legível nos dois temas. */
export function TechIcon({ name, className }: TechIconProps) {
  const icon = name ? techIcons[name] : undefined;
  if (!icon) return null;

  return (
    <svg
      aria-hidden
      className={cn("size-4 shrink-0 fill-current", className)}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  );
}
