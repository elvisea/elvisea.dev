/**
 * Hero da home: nome, cargo, stack e links. Sem slogan (ver AGENTS.md).
 * A ordem dos botões segue os públicos: currículo para quem contrata,
 * serviços para empresas, depois LinkedIn e GitHub.
 */
import Link from "next/link";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { HeroModel } from "@/features/home/page/view-model/get-home-view-model";
import { cn } from "cn";

const actionClass = (primary: boolean) =>
  cn(
    buttonVariants({ variant: primary ? "default" : "outline", size: "lg" }),
    "h-11 w-full px-5 sm:w-auto",
  );

export function HeroSection({ model }: { model: HeroModel }) {
  return (
    <section className="bg-hero-decor relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl space-y-5">
          <Eyebrow>{model.location}</Eyebrow>
          {/* H1 com nome e cargo (lido como "Nome — Cargo"); visualmente em duas linhas. */}
          <h1 className="space-y-5">
            <span className="block text-4xl font-bold tracking-tight text-balance text-heading md:text-5xl lg:text-6xl">
              {model.name}
            </span>
            <span className="sr-only"> — </span>
            <span className="block text-xl font-normal text-muted-foreground md:text-2xl">
              {model.role}
            </span>
          </h1>
          <ul
            aria-label={model.stackLabel}
            className="flex flex-wrap gap-2 pt-1"
          >
            {model.stack.map((tech) => (
              <li key={tech}>
                <Badge
                  className="h-7 bg-card/70 px-3 font-mono"
                  variant="outline"
                >
                  {tech}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {model.actions.map((action, index) =>
            action.external ? (
              <a
                key={action.href}
                className={actionClass(index === 0)}
                href={action.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {action.label}
              </a>
            ) : (
              <Link
                key={action.href}
                className={actionClass(index === 0)}
                href={action.href}
              >
                {action.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
