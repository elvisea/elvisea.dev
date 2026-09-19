import type { ContactFormValues } from "@/features/contact/form/validations";

/** Resposta da Server Action ao formulário. */
export type ContactActionState =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      values?: ContactFormValues;
    };

/** Assinatura da Server Action, injetável no view-model do formulário. */
export type ContactAction = (
  previous: ContactActionState | null,
  formData: FormData,
) => Promise<ContactActionState>;
