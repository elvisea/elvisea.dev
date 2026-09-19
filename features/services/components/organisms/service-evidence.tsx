import { ArrowLink } from "@/components/atoms/arrow-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EvidenceModel } from "@/features/services/detail/view-model/get-service-detail-view-model";

/** Evidências de um serviço: experiência, projeto próprio ou código aberto. */
export function ServiceEvidence({
  items,
  linkLabel,
}: {
  items: readonly EvidenceModel[];
  linkLabel: string;
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={`${item.kind}-${item.title}`}>
          <Card className="h-full">
            <CardHeader>
              <Badge className="w-fit font-mono" variant="secondary">
                {item.kindLabel}
              </Badge>
              <CardTitle className="text-base font-semibold text-heading">
                <h3>{item.title}</h3>
              </CardTitle>
              <CardDescription className="text-pretty text-foreground">
                {item.description}
              </CardDescription>
            </CardHeader>
            {item.href ? (
              <CardFooter className="mt-auto py-2">
                <ArrowLink
                  direction={item.external ? "external" : "forward"}
                  href={item.href}
                  size="sm"
                >
                  {linkLabel}
                  <span className="sr-only">: {item.title}</span>
                </ArrowLink>
              </CardFooter>
            ) : (
              <CardContent className="mt-auto" />
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
