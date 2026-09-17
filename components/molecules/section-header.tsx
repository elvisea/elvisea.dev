import { cn } from "cn";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** `h1` no topo de páginas internas; `h2` em seções. */
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl space-y-3", className)}>
      <p className="font-mono text-sm text-highlight">{eyebrow}</p>
      <Heading
        className={cn(
          "font-bold tracking-tight text-balance text-heading",
          Heading === "h1" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="text-lg text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
