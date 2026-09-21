/**
 * Porta de acesso ao conteúdo profissional: perfil, stack, formação e
 * certificados. A fonte entra por parâmetro para os testes injetarem dados.
 */
import { certificados } from "@/content/pt-BR/certificados";
import { formacao } from "@/content/pt-BR/formacao";
import { perfil } from "@/content/pt-BR/perfil";
import { stack } from "@/content/pt-BR/stack";
import type {
  Certificate,
  Education,
  StackGroup,
  StackItem,
} from "@/lib/content/types";

/** Perfil profissional (`content/pt-BR/perfil.ts`). */
export interface Profile {
  resumo: string;
  atuacao: readonly string[];
  engenhariaComIa: string;
  projetosProprios: string;
}

export interface AboutSource {
  profile: Profile;
  stack: readonly StackGroup[];
  education: readonly Education[];
  certificates: readonly Certificate[];
}

export interface AboutRepository {
  profile(): Profile;
  stackGroups(): readonly StackGroup[];
  /** Item da stack pelo `key` (usado pelas badges de experiência e serviços). */
  stackItem(key: string): StackItem | undefined;
  education(): readonly Education[];
  /** Certificados visíveis: com data primeiro (mais recente antes), depois sem data. */
  certificates(): Certificate[];
}

export function createAboutRepository(source: AboutSource): AboutRepository {
  const stackItems = new Map<string, StackItem>(
    source.stack.flatMap((group) =>
      group.items.map((item) => [item.key, item]),
    ),
  );

  return {
    profile: () => source.profile,
    stackGroups: () => source.stack,
    stackItem: (key) => stackItems.get(key),
    education: () => source.education,
    certificates: () =>
      source.certificates
        .filter((certificate) => certificate.visible)
        .sort((a, b) => {
          if (a.issued && b.issued) return b.issued.localeCompare(a.issued);
          if (a.issued) return -1;
          if (b.issued) return 1;
          return 0;
        }),
  };
}

export const aboutRepository = createAboutRepository({
  profile: perfil,
  stack,
  education: formacao,
  certificates: certificados,
});
