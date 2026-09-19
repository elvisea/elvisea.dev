import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface ContactMessageFieldProps {
  label: string;
  defaultValue?: string;
  errors?: { message: string }[];
}

/** Mensagem do contato (até 4.000 caracteres, o mesmo limite do schema). */
export function ContactMessageField({
  label,
  defaultValue,
  errors,
}: ContactMessageFieldProps) {
  const invalid = Boolean(errors?.length) || undefined;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="contato-mensagem">{label}</FieldLabel>
      <Textarea
        aria-invalid={invalid}
        className="min-h-40"
        defaultValue={defaultValue}
        id="contato-mensagem"
        maxLength={4000}
        name="message"
        required
      />
      <FieldError errors={errors} />
    </Field>
  );
}
