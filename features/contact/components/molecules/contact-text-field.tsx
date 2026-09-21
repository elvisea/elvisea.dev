import type { HTMLAttributes } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ContactTextFieldProps {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  defaultValue?: string;
  errors?: { message: string }[];
  /** Dica abaixo do campo (ex.: "Opcional"), ligada por `aria-describedby`. */
  hint?: string;
  required?: boolean;
  type?: "text" | "email";
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}

/** Campo de texto de uma linha do formulário de contato. */
export function ContactTextField({
  id,
  name,
  label,
  autoComplete,
  defaultValue,
  errors,
  hint,
  required,
  type,
  inputMode,
}: ContactTextFieldProps) {
  const invalid = Boolean(errors?.length) || undefined;
  const hintId = hint ? `${id}-dica` : undefined;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        aria-describedby={hintId}
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className="h-11"
        defaultValue={defaultValue}
        id={id}
        inputMode={inputMode}
        name={name}
        required={required}
        type={type}
      />
      {hint ? <FieldDescription id={hintId}>{hint}</FieldDescription> : null}
      <FieldError errors={errors} />
    </Field>
  );
}
