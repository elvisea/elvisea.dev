/**
 * Badges de tecnologia a partir das chaves da stack. Usado pela timeline de
 * experiência e pelas páginas de serviço: a chave sem item conhecido aparece
 * como está, sem ícone.
 */
import type { StackItem } from "@/lib/content/types";

export interface StackBadgeModel {
  key: string;
  label: string;
  /** Nome do ícone em `simple-icons`, quando houver. */
  icon?: string;
}

export function toStackBadges(
  keys: readonly string[],
  lookup: (key: string) => StackItem | undefined,
): StackBadgeModel[] {
  return keys.map((key) => {
    const item = lookup(key);
    return { key, label: item?.label ?? key, icon: item?.icon };
  });
}
