/**
 * Linha do tempo de experiências.
 *
 * - `compact` (home): período, cargo, empresa, abertura e stack.
 * - `full` (`/experiencia`): também os blocos de bullets; cada item tem âncora.
 */
import Link from "next/link";

import { StackBadges } from "@/components/molecules/stack-badges";
import { experienciaPage } from "@/content/pt-BR/pages/profissional";
import { formatPeriod } from "@/lib/content/dates";
import type { Experience } from "@/lib/content/types";
import { cn } from "cn";

interface ExperienceTimelineProps {
  experiences: readonly Experience[];
  variant?: "compact" | "full";
}

export function ExperienceTimeline({
  experiences,
  variant = "full",
}: ExperienceTimelineProps) {
  const full = variant === "full";

  return (
    <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
      {experiences.map((exp) => {
        const current = exp.end === null;
        const place = [exp.location, experienciaPage.modes[exp.mode]]
          .filter(Boolean)
          .join(" · ");

        return (
          <li
            key={exp.slug}
            className="relative scroll-mt-24"
            id={full ? exp.slug : undefined}
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 -left-[29.5px] size-3 rounded-full border-2 border-background sm:-left-[37.5px]",
                current ? "bg-primary" : "bg-muted-foreground/50",
              )}
            />
            <article className="space-y-3">
              <header className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPeriod(exp.start, exp.end)}
                </p>
                <h3 className="text-lg font-semibold text-heading">
                  {full ? (
                    exp.role
                  ) : (
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={`/experiencia#${exp.slug}`}
                    >
                      {exp.role}
                    </Link>
                  )}
                </h3>
                <p className="text-sm text-foreground">
                  {exp.companyUrl ? (
                    <a
                      aria-label={`${exp.company} — ${experienciaPage.labels.companyPage}`}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      href={exp.companyUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <span className="font-medium">{exp.company}</span>
                  )}
                  {exp.engagement ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {exp.engagement}
                    </span>
                  ) : null}
                </p>
                {place ? (
                  <p className="text-sm text-muted-foreground">{place}</p>
                ) : null}
              </header>

              <div className="space-y-2 text-pretty text-foreground">
                {(full ? exp.summary : exp.summary.slice(0, 1)).map(
                  (paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ),
                )}
              </div>

              {full
                ? exp.groups.map((group) => (
                    <div key={group.title ?? "itens"} className="space-y-2">
                      {group.title ? (
                        <h4 className="font-mono text-xs tracking-wide text-highlight uppercase">
                          {group.title}
                        </h4>
                      ) : null}
                      <ul className="list-disc space-y-1.5 pl-5 text-pretty text-foreground marker:text-muted-foreground">
                        {group.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                : null}

              <StackBadges
                keys={exp.stack}
                label={`${experienciaPage.labels.stack} na ${exp.company}`}
              />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
