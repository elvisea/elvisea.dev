"use client";

/**
 * View-model do formulário de contato: estado da Server Action, marca de
 * início do anti-spam, erros por campo, chave de remontagem e recomeço.
 */
import { useActionState, useEffect, useRef, useState } from "react";

import { submitContact } from "@/features/contact/repository/submit-contact-action";
import type { ContactAction } from "@/features/contact/repository/types";

import { fieldErrorsOf, fieldsKeyOf } from "./contact-form-state";

interface Options {
  action?: ContactAction;
  now?: () => number;
  /** O estado de `useActionState` não tem reset: recarregar dá um formulário limpo. */
  restart?: () => void;
}

export function useContactFormViewModel({
  action = submitContact,
  now = Date.now,
  restart = () => window.location.reload(),
}: Options = {}) {
  const [state, formAction, pending] = useActionState(action, null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  // Relógio fixado na montagem: um `now` novo a cada render não reinicia a marca.
  const [clock] = useState(() => now);

  // Marca o início do preenchimento só no navegador (evita divergência de
  // hidratação). Fica fora dos campos remontados para não reiniciar a contagem.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(clock());
  }, [clock]);

  const failure = state && !state.ok ? state : null;

  return {
    formAction,
    pending,
    sent: state?.ok === true,
    error: failure?.error ?? null,
    values: failure?.values,
    fieldsKey: fieldsKeyOf(state),
    errorsOf: (name: string) => fieldErrorsOf(state, name),
    invalid: (name: string) => Boolean(fieldErrorsOf(state, name)?.length),
    startedAtRef,
    restart,
  };
}

export type ContactFormViewModel = ReturnType<typeof useContactFormViewModel>;
