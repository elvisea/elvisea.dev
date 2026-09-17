"use client";

import * as React from "react";
import {
  LucideMoon as MoonIcon,
  LucideSun as SunIcon,
  LucideSunMoon as SunMoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { site } from "@/content/pt-BR/site";
import { cn } from "@/lib/utils";

function useClientMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Alterna tema claro / escuro — `next-themes` aplica/remover classe `dark` em `<html>`. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useClientMounted();

  function cycleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  if (!mounted) {
    // Placeholder sem Base UI: o primitivo resolve `disabled` via ref do DOM,
    // o que diverge entre SSR (sem ref) e cliente (com ref) — causa de hydration mismatch.
    return (
      <button
        aria-hidden
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-10 shrink-0",
        )}
        disabled
        type="button"
      >
        <SunMoonIcon aria-hidden className="size-5 opacity-60" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={
        isDark ? site.theme.toggleLightAria : site.theme.toggleDarkAria
      }
      className="size-10 shrink-0"
      size="icon"
      type="button"
      variant="outline"
      onClick={cycleTheme}
    >
      {isDark ? (
        <SunIcon aria-hidden className="size-5" />
      ) : (
        <MoonIcon aria-hidden className="size-5" />
      )}
    </Button>
  );
}
