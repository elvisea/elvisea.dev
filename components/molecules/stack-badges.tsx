import { TechIcon } from "@/components/atoms/tech-icon";
import { Badge } from "@/components/ui/badge";

export interface StackBadge {
  key: string;
  label: string;
  /** Nome do ícone em `simple-icons`, quando houver. */
  icon?: string;
}

interface StackBadgesProps {
  items: readonly StackBadge[];
  /** Nome acessível da lista (ex.: "Tecnologias usadas na ATZ AERO"). */
  label: string;
}

/** Tecnologias de uma experiência ou serviço, com ícone quando houver. */
export function StackBadges({ items, label }: StackBadgesProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.key}>
          <Badge className="h-6 px-2.5 font-mono" variant="outline">
            <TechIcon data-icon="inline-start" name={item.icon} />
            {item.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
