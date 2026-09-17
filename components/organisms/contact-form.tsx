"use client";

/**
 * Formulário de contato (Server Action `submitContact`).
 *
 * Anti-spam sem captcha: campo isca invisível (`website`) e `startedAt`
 * preenchido no navegador ao montar; a action descarta envios com isca
 * preenchida ou feitos rápido demais.
 */
import { useActionState, useEffect, useRef } from "react";

import { CheckCircle2Icon } from "lucide-react";

import {
  submitContact,
  type ContactActionState,
} from "@/app/actions/contact/action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { contatoPage } from "@/content/pt-BR/pages/contato";

const { fields } = contatoPage;

function errorsOf(state: ContactActionState | null, name: string) {
  if (!state || state.ok) return undefined;
  return state.fieldErrors?.[name]?.map((message) => ({ message }));
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Marca o início do preenchimento só no navegador (evita divergência de hidratação).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  if (state?.ok) {
    return (
      <div
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        role="status"
      >
        <CheckCircle2Icon aria-hidden className="size-8 text-primary" />
        <h2 className="text-xl font-semibold text-heading">
          {contatoPage.success.title}
        </h2>
        <p className="text-muted-foreground">
          {contatoPage.success.description}
        </p>
        <Button
          className="h-11 px-5"
          type="button"
          variant="outline"
          // O estado de useActionState não tem reset: recarregar dá um formulário limpo.
          onClick={() => window.location.reload()}
        >
          {contatoPage.success.again}
        </Button>
      </div>
    );
  }

  const values = state && !state.ok ? state.values : undefined;
  const invalid = (name: string) => Boolean(errorsOf(state, name)?.length);
  // Os campos do Base UI não aceitam troca de `defaultValue` depois de montados.
  // Quando a action devolve os valores digitados, a `key` muda e os campos são
  // remontados já com esses valores. O `startedAt` fica fora deste trecho para
  // não reiniciar a contagem do anti-spam.
  const fieldsKey = values ? JSON.stringify(values) : "inicial";

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-xl border border-border bg-card p-6"
      noValidate
    >
      {state && !state.ok ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <FieldGroup key={fieldsKey}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={invalid("name") || undefined}>
            <FieldLabel htmlFor="contato-nome">{fields.name.label}</FieldLabel>
            <Input
              aria-invalid={invalid("name") || undefined}
              autoComplete={fields.name.autoComplete}
              className="h-11"
              defaultValue={values?.name}
              id="contato-nome"
              name="name"
              required
            />
            <FieldError errors={errorsOf(state, "name")} />
          </Field>

          <Field data-invalid={invalid("email") || undefined}>
            <FieldLabel htmlFor="contato-email">
              {fields.email.label}
            </FieldLabel>
            <Input
              aria-invalid={invalid("email") || undefined}
              autoComplete={fields.email.autoComplete}
              className="h-11"
              defaultValue={values?.email}
              id="contato-email"
              inputMode="email"
              name="email"
              required
              type="email"
            />
            <FieldError errors={errorsOf(state, "email")} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={invalid("company") || undefined}>
            <FieldLabel htmlFor="contato-empresa">
              {fields.company.label}
            </FieldLabel>
            <Input
              aria-describedby="contato-empresa-dica"
              aria-invalid={invalid("company") || undefined}
              autoComplete={fields.company.autoComplete}
              className="h-11"
              defaultValue={values?.company}
              id="contato-empresa"
              name="company"
            />
            <FieldDescription id="contato-empresa-dica">
              {fields.company.hint}
            </FieldDescription>
            <FieldError errors={errorsOf(state, "company")} />
          </Field>

          <Field data-invalid={invalid("reason") || undefined}>
            <FieldLabel htmlFor="contato-assunto">
              {fields.reason.label}
            </FieldLabel>
            <NativeSelect
              aria-invalid={invalid("reason") || undefined}
              className="w-full [&_select]:h-11"
              defaultValue={values?.reason ?? ""}
              id="contato-assunto"
              name="reason"
              required
            >
              <NativeSelectOption disabled value="">
                {fields.reason.placeholder}
              </NativeSelectOption>
              {fields.reason.options.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError errors={errorsOf(state, "reason")} />
          </Field>
        </div>

        <Field data-invalid={invalid("message") || undefined}>
          <FieldLabel htmlFor="contato-mensagem">
            {fields.message.label}
          </FieldLabel>
          <Textarea
            aria-invalid={invalid("message") || undefined}
            className="min-h-40"
            defaultValue={values?.message}
            id="contato-mensagem"
            maxLength={4000}
            name="message"
            required
          />
          <FieldError errors={errorsOf(state, "message")} />
        </Field>
      </FieldGroup>

      {/* Isca para robôs: fora da tela e fora da ordem de tabulação. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contato-website">{fields.honeypot.label}</label>
        <input
          autoComplete="off"
          id="contato-website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>
      <input ref={startedAtRef} name="startedAt" type="hidden" />

      <Button
        className="h-11 w-full px-6 sm:w-auto"
        disabled={pending}
        type="submit"
      >
        {pending ? contatoPage.submitting : contatoPage.submit}
      </Button>
    </form>
  );
}
