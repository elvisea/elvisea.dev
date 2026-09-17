import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/pt-BR/site";
import { cn } from "@/lib/utils";

/** Hero da home: nome, cargo, stack e links. Sem slogan (ver AGENTS.md). */
export function HeroSection() {
  return (
    <section className="bg-hero-decor relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl space-y-5">
          <p className="font-mono text-sm text-highlight">
            {site.person.location}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance text-heading md:text-5xl lg:text-6xl">
            {site.person.name}
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl">
            {site.person.role}
          </p>
          <ul
            aria-label="Stack principal"
            className="flex flex-wrap gap-2 pt-1"
          >
            {site.person.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-xs text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {Object.values(site.links).map((link, index) => (
            <a
              key={link.href}
              className={cn(
                buttonVariants({
                  variant: index === 0 ? "default" : "outline",
                  size: "lg",
                }),
                "h-11 w-full px-5 sm:w-auto",
              )}
              href={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
