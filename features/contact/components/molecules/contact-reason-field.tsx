import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactReasonFieldProps {
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  defaultValue: string | null;
  errors?: { message: string }[];
  /** Serviço de origem, mostrado abaixo do assunto quando o contato vem de um serviço. */
  service?: { label: string; title: string } | null;
}

/** Assunto do contato (`Select`), com o serviço de origem quando houver. */
export function ContactReasonField({
  label,
  placeholder,
  options,
  defaultValue,
  errors,
  service,
}: ContactReasonFieldProps) {
  const invalid = Boolean(errors?.length) || undefined;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="contato-assunto">{label}</FieldLabel>
      <Select
        defaultValue={defaultValue}
        items={options}
        name="reason"
        required
      >
        <SelectTrigger
          aria-invalid={invalid}
          className="w-full data-[size=default]:h-11"
          id="contato-assunto"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {service ? (
        <FieldDescription>
          {service.label}: {service.title}
        </FieldDescription>
      ) : null}
      <FieldError errors={errors} />
    </Field>
  );
}
