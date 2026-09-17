import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { homePage } from "@/content/pt-BR/pages/profissional";
import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { site } from "@/content/pt-BR/site";
import { SERVICES_PATH } from "@/features/services/routes";
import { cn } from "cn";

/**
 * Hero da home: nome, cargo, stack e links. Sem slogan (ver AGENTS.md).
 * Ordem dos botões segue os públicos (AGENTS.md): currículo para quem
 * contrata, serviços para empresas, depois LinkedIn e GitHub.
 */
export function HeroSection() {
  return (
    <section className="bg-hero-decor relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl space-y-5">
          <p className="font-mono text-sm text-highlight">
            {site.person.location}
          </p>
          {/* H1 com nome e cargo (lido como "Nome — Cargo"); visualmente em duas linhas. */}
          <h1 className="space-y-5">
            <span className="block text-4xl font-bold tracking-tight text-balance text-heading md:text-5xl lg:text-6xl">
              {site.person.name}
            </span>
            <span className="sr-only"> — </span>
            <span className="block text-xl font-normal text-muted-foreground md:text-2xl">
              {site.person.role}
            </span>
          </h1>
          <ul
            aria-label={homePage.hero.stackLabel}
            className="flex flex-wrap gap-2 pt-1"
          >
            {site.person.stack.map((tech) => (
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
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full px-5 sm:w-auto",
            )}
            href="/curriculo"
          >
            {homePage.hero.resume}
          </Link>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full px-5 sm:w-auto",
            )}
            href={SERVICES_PATH}
          >
            {servicosPage.home.heroCta}
          </Link>
          <a
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full px-5 sm:w-auto",
            )}
            href={site.links.linkedin.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {site.links.linkedin.label}
          </a>
          <a
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full px-5 sm:w-auto",
            )}
            href={site.links.github.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {site.links.github.label}
          </a>
        </div>
      </div>
    </section>
  );
}
