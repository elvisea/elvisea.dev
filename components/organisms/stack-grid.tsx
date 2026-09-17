import { TechIcon } from "@/components/atoms/tech-icon";
import { stack } from "@/content/pt-BR/stack";

/** Stack agrupada por área, com ícones. Sem nível de proficiência. */
export function StackGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stack.map((group) => (
        <section
          key={group.title}
          aria-label={group.title}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-mono text-xs tracking-wide text-highlight uppercase">
            {group.title}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item.key}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              >
                <TechIcon name={item.icon} />
                {item.label}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
