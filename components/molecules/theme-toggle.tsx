"use client";

import * as React from "react";
import {
  LucideMoon as MoonIcon,
  LucideSun as SunIcon,
  LucideSunMoon as SunMoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { site } from "@/content/pt-BR/site";

function useClientMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Alterna tema claro/escuro (`next-themes` aplica a classe `dark` no `<html>`).
 * Antes de montar, o tema resolvido é desconhecido: o botão mostra um ícone
 * neutro e um rótulo genérico, sem `disabled` (evita divergência de
 * hidratação no Button do Base UI).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useClientMounted();
  const isDark = mounted && resolvedTheme === "dark";

  const label = !mounted
    ? site.theme.toggleAria
    : isDark
      ? site.theme.toggleLightAria
      : site.theme.toggleDarkAria;

  return (
    <Button
      aria-label={label}
      className="size-10 shrink-0"
      size="icon"
      type="button"
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {!mounted ? (
        <SunMoonIcon aria-hidden className="size-5 opacity-60" />
      ) : isDark ? (
        <SunIcon aria-hidden className="size-5" />
      ) : (
        <MoonIcon aria-hidden className="size-5" />
      )}
    </Button>
  );
}
