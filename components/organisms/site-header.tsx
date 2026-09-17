"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LucideChevronRight as ChevronRightIcon,
  LucideMenu as MenuIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site, type NavItem } from "@/content/pt-BR/site";
import { cn } from "cn";

/** Rota ativa por prefixo (ex.: `/blog/post` ativa `/blog`). A home não está no menu. */
function isActive(item: NavItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:h-16 sm:px-6">
        <Link
          className="group flex shrink-0 items-baseline gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="/"
        >
          <span className="font-semibold tracking-tight text-heading">
            {site.person.name}
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary sm:inline">
            {site.domain}
          </span>
          {/* Complemento só para leitor de tela, depois do texto visível. */}
          <span className="sr-only"> — {site.a11y.homeLinkHint}</span>
        </Link>

        <nav
          aria-label={site.a11y.mainNav}
          className="hidden items-center gap-1 md:flex"
        >
          {site.navigation.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "text-heading"
                    : "text-muted-foreground hover:text-heading",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    aria-expanded={mobileOpen}
                    aria-label={site.a11y.openMenu}
                    className="size-10 shrink-0"
                    size="icon"
                    type="button"
                    variant="outline"
                  />
                }
              >
                <MenuIcon aria-hidden className="size-5" />
              </SheetTrigger>
              <SheetContent
                className="gap-0 p-0 data-[side=right]:w-[min(100%,320px)]"
                side="right"
              >
                <div className="flex h-[100dvh] max-h-[100dvh] flex-col">
                  <div className="border-b border-border bg-surface pt-14 pr-14 pb-6 pl-6">
                    <SheetTitle className="text-left text-xl font-semibold tracking-tight text-heading">
                      {site.person.name}
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-left text-sm text-muted-foreground">
                      {site.person.role}
                    </SheetDescription>
                  </div>

                  <nav
                    aria-label={site.a11y.mobileNav}
                    className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 pb-6"
                  >
                    {site.navigation.map((item) => {
                      const active = isActive(item, pathname);
                      return (
                        <SheetClose
                          key={item.href}
                          aria-current={active ? "page" : undefined}
                          nativeButton={false}
                          render={
                            <Link
                              className={cn(
                                "group flex touch-manipulation items-center justify-between rounded-xl border border-transparent px-4 py-3.5 text-left text-base font-medium transition-colors outline-none hover:border-border hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                                active
                                  ? "bg-muted text-heading"
                                  : "text-muted-foreground",
                              )}
                              href={item.href}
                            />
                          }
                        >
                          <span>{item.label}</span>
                          <ChevronRightIcon
                            aria-hidden
                            className="size-5 shrink-0 opacity-40 transition-opacity group-hover:opacity-80"
                          />
                        </SheetClose>
                      );
                    })}
                  </nav>

                  <div className="mt-auto flex items-center justify-center gap-6 border-t border-border bg-surface px-6 py-5 text-sm">
                    {Object.values(site.links).map((link) => (
                      <a
                        key={link.href}
                        className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                        href={link.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
