import { TechIcon } from "@/components/atoms/tech-icon";
import { getStackItem } from "@/lib/content";

interface StackBadgesProps {
  keys: readonly string[];
  label: string;
}

/** Tecnologias de uma experiência ou projeto, com ícone quando houver. */
export function StackBadges({ keys, label }: StackBadgesProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const item = getStackItem(key);
        return (
          <li
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
          >
            <TechIcon className="size-3.5" name={item?.icon} />
            {item?.label ?? key}
          </li>
        );
      })}
    </ul>
  );
}
