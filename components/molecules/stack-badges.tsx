import { TechIcon } from "@/components/atoms/tech-icon";
import { Badge } from "@/components/ui/badge";
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
          <li key={key}>
            <Badge className="h-6 px-2.5 font-mono" variant="outline">
              <TechIcon data-icon="inline-start" name={item?.icon} />
              {item?.label ?? key}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
