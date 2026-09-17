import Link from "next/link";

import { site } from "@/content/pt-BR/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-heading">{site.person.name}</p>
          <p className="text-sm text-muted-foreground">
            {site.person.role} · {site.person.location}
          </p>
        </div>
        <nav
          aria-label={site.a11y.footerNav}
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              className="text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          {Object.values(site.links).map((link) => (
            <a
              key={link.href}
              className="text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
              href={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>
            © {year} {site.footer.copyright}
          </span>
          <span className="font-mono">{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
