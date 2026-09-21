import { CheckIcon } from "lucide-react";

/** Lista com marcador de check (para quem é, o que entrego). */
export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-pretty text-foreground">
          <CheckIcon
            aria-hidden
            className="mt-1 size-4 shrink-0 text-primary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
