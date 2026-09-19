import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";

interface CtaCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
}

/** Card de chamada para ação no fim de uma página: título, texto e botão. */
export function CtaCard({ title, description, cta, href }: CtaCardProps) {
  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-heading">
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription className="text-pretty text-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          href={href}
        >
          {cta}
        </Link>
      </CardFooter>
    </Card>
  );
}
