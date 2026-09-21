/** Navegação do site: itens e qual deles está ativo. */
export interface NavLink {
  href: string;
  label: string;
  /** Página atual (`aria-current="page"`). */
  active?: boolean;
}

/**
 * Rota ativa por prefixo (ex.: `/blog/post` ativa `/blog`). A home não está
 * no menu, então `/` nunca casa por prefixo.
 */
export function isActiveNavItem(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function markActiveNav(
  items: readonly { href: string; label: string }[],
  pathname: string,
): NavLink[] {
  return items.map((item) => ({
    href: item.href,
    label: item.label,
    active: isActiveNavItem(item.href, pathname),
  }));
}
