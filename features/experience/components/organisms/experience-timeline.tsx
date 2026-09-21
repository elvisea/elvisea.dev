/**
 * Linha do tempo de experiências. As entradas chegam prontas do view-model
 * (período, local, parágrafos e badges); aqui só a marcação.
 */
import Link from "next/link";

import { MonoLabel } from "@/components/atoms/mono-label";
import { StackBadges } from "@/components/molecules/stack-badges";
import type { TimelineEntry } from "@/features/experience/domain/timeline";
import { cn } from "cn";

export function ExperienceTimeline({
  entries,
}: {
  entries: readonly TimelineEntry[];
}) {
  return (
    <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
      {entries.map((entry) => (
        <li
          key={entry.slug}
          className="relative scroll-mt-24"
          id={entry.anchor ?? undefined}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-1.5 -left-[29.5px] size-3 rounded-full border-2 border-background sm:-left-[37.5px]",
              entry.current ? "bg-primary" : "bg-muted-foreground/50",
            )}
          />
          <article className="space-y-3">
            <header className="space-y-1">
              <p className="font-mono text-xs text-muted-foreground">
                {entry.period}
              </p>
              <h3 className="text-lg font-semibold text-heading">
                {entry.roleHref ? (
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={entry.roleHref}
                  >
                    {entry.role}
                  </Link>
                ) : (
                  entry.role
                )}
              </h3>
              <p className="text-sm text-foreground">
                {entry.company.href ? (
                  <a
                    aria-label={entry.company.ariaLabel}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    href={entry.company.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {entry.company.name}
                  </a>
                ) : (
                  <span className="font-medium">{entry.company.name}</span>
                )}
                {entry.engagement ? (
                  <span className="text-muted-foreground">
                    {" "}
                    · {entry.engagement}
                  </span>
                ) : null}
              </p>
              {entry.place ? (
                <p className="text-sm text-muted-foreground">{entry.place}</p>
              ) : null}
            </header>

            <div className="space-y-2 text-pretty text-foreground">
              {entry.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {entry.groups.map((group) => (
              <div key={group.title ?? "itens"} className="space-y-2">
                {group.title ? (
                  <MonoLabel as="h4">{group.title}</MonoLabel>
                ) : null}
                <ul className="list-disc space-y-1.5 pl-5 text-pretty text-foreground marker:text-muted-foreground">
                  {group.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}

            <StackBadges items={entry.stack.badges} label={entry.stack.label} />
          </article>
        </li>
      ))}
    </ol>
  );
}
