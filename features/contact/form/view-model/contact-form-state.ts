/** Leitura do estado devolvido pela Server Action, para o formulário. */
import type { ContactActionState } from "@/features/contact/repository/types";

/** Erros de um campo no formato do `FieldError` do shadcn. */
export function fieldErrorsOf(
  state: ContactActionState | null,
  name: string,
): { message: string }[] | undefined {
  if (!state || state.ok) return undefined;
  return state.fieldErrors?.[name]?.map((message) => ({ message }));
}

/**
 * Chave dos campos. Os campos do Base UI não aceitam troca de `defaultValue`
 * depois de montados: quando a action devolve os valores digitados, a chave
 * muda e os campos são remontados já com esses valores.
 */
export function fieldsKeyOf(state: ContactActionState | null): string {
  return state && !state.ok && state.values
    ? JSON.stringify(state.values)
    : "inicial";
}
