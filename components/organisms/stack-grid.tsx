import { TechIcon } from "@/components/atoms/tech-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stack } from "@/content/pt-BR/stack";

/** Stack agrupada por área, com ícones. Sem nível de proficiência. */
export function StackGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stack.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="font-mono text-xs tracking-wide text-highlight uppercase">
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul aria-label={group.title} className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item.key}>
                  <Badge className="h-8 gap-2 px-3 text-sm" variant="outline">
                    <TechIcon className="size-4!" name={item.icon} />
                    {item.label}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
