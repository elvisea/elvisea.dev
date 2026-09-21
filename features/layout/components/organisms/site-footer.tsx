import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import type { SiteFooterViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

const linkClass =
  "text-muted-foreground underline-offset-4 hover:text-heading hover:underline";

/** Rodapé: identificação, navegação, links externos e direitos. */
export function SiteFooter({ model }: { model: SiteFooterViewModel }) {
  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-heading">{model.person.name}</p>
          <p className="text-sm text-muted-foreground">
            {model.person.role} · {model.person.location}
          </p>
        </div>
        <nav
          aria-label={model.labels.footerNav}
          className="flex flex-col gap-3 text-sm md:items-end"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {model.navigation.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {model.pages.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            {model.externalLinks.map((link) => (
              <li key={link.href}>
                <a
                  className={linkClass}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-6xl space-y-6 px-4 sm:px-6">
        <Separator />
        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {model.copyright.year} {model.copyright.holder}
          </span>
          <span className="font-mono">{model.labels.domain}</span>
        </div>
      </div>
    </footer>
  );
}
