/**
 * Perfil e stack em texto, usados por `/sobre` e pela home. Funções puras:
 * recebem o conteúdo do repository e devolvem o que a tela mostra.
 */
import type { StackBadgeModel } from "@/features/about/domain/stack-badges";
import type { Profile } from "@/features/about/repository/about-repository";
import type { StackGroup } from "@/lib/content/types";

export interface ProfileModel {
  summary: string;
  atuacao: { title: string; items: readonly string[] };
}

export interface StackGroupModel {
  title: string;
  items: readonly StackBadgeModel[];
}

export function toProfileModel(
  profile: Profile,
  atuacaoTitle: string,
): ProfileModel {
  return {
    summary: profile.resumo,
    atuacao: { title: atuacaoTitle, items: profile.atuacao },
  };
}

export function toStackGroups(
  groups: readonly StackGroup[],
): StackGroupModel[] {
  return groups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
    })),
  }));
}
