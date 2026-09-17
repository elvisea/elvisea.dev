import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { site } from "@/content/pt-BR/site";

const linkClass =
  "text-muted-foreground underline-offset-4 hover:text-heading hover:underline";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const external = Object.values(site.links);

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
          className="flex flex-col gap-3 text-sm md:items-end"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.footerLinks.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            {external.map((link) => (
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
            © {year} {site.footer.copyright}
          </span>
          <span className="font-mono">{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
