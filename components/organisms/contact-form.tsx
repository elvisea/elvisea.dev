"use client";

/**
 * Formulário de contato (Server Action `submitContact`).
 *
 * Anti-spam sem captcha: campo isca invisível (`website`) e `startedAt`
 * preenchido no navegador ao montar; a action descarta envios com isca
 * preenchida ou feitos rápido demais.
 */
import { useActionState, useEffect, useRef } from "react";

import { CheckCircle2Icon, CircleAlertIcon } from "lucide-react";

import {
  submitContact,
  type ContactActionState,
} from "@/app/actions/contact/action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <Alert className="gap-2 p-6" role="status">
        <CheckCircle2Icon aria-hidden className="size-6! text-primary!" />
        <AlertTitle className="text-lg text-heading">
          {contatoPage.success.title}
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{contatoPage.success.description}</p>
          <Button
            className="h-11 px-5"
            type="button"
            variant="outline"
            // O estado de useActionState não tem reset: recarregar dá um formulário limpo.
            onClick={() => window.location.reload()}
          >
            {contatoPage.success.again}
          </Button>
        </AlertDescription>
      </Alert>
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
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6" noValidate>
          {state && !state.ok ? (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup key={fieldsKey}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={invalid("name") || undefined}>
                <FieldLabel htmlFor="contato-nome">
                  {fields.name.label}
                </FieldLabel>
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
                <Select
                  defaultValue={values?.reason || null}
                  items={fields.reason.options}
                  name="reason"
                  required
                >
                  <SelectTrigger
                    aria-invalid={invalid("reason") || undefined}
                    className="w-full data-[size=default]:h-11"
                    id="contato-assunto"
                  >
                    <SelectValue placeholder={fields.reason.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fields.reason.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

          {/*
        Isca para robôs: fora da tela, fora da ordem de tabulação e da árvore de
        acessibilidade. Inputs nativos de propósito: componentes do Base UI
        acrescentam comportamento (foco, estados) que não cabe num campo oculto.
      */}
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
      </CardContent>
    </Card>
  );
}
