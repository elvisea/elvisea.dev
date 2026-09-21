"use client";

/** Estado do cabeçalho: menu mobile aberto e item de navegação ativo. */
import { usePathname } from "next/navigation";
import { useState } from "react";

import { markActiveNav, type NavLink } from "@/features/layout/domain/nav";

export function useSiteHeaderViewModel(
  navigation: readonly { href: string; label: string }[],
): {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  links: NavLink[];
} {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return {
    mobileOpen,
    setMobileOpen,
    links: markActiveNav(navigation, pathname),
  };
}
