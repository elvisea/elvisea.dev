"use client";

/**
 * Formulário de contato. O estado fica no view-model
 * (`useContactFormViewModel`); aqui só a composição dos campos.
 *
 * Vindo de uma página de serviço, `prefill` pré-seleciona o assunto e envia o
 * serviço num campo oculto (ver `form/prefill.ts`). Anti-spam sem captcha:
 * campo isca e marca de início do preenchimento (ver `form/anti-spam.ts`).
 */
import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { HoneypotField } from "@/features/contact/components/atoms/honeypot-field";
import { ContactMessageField } from "@/features/contact/components/molecules/contact-message-field";
import { ContactReasonField } from "@/features/contact/components/molecules/contact-reason-field";
import { ContactSuccess } from "@/features/contact/components/molecules/contact-success";
import { ContactTextField } from "@/features/contact/components/molecules/contact-text-field";
import type { ContactPrefill } from "@/features/contact/form/prefill";
import type { ContactFormTexts } from "@/features/contact/form/view-model/get-contact-view-model";
import { useContactFormViewModel } from "@/features/contact/form/view-model/use-contact-form-view-model";
import type { ContactAction } from "@/features/contact/repository/types";

interface ContactFormProps {
  texts: ContactFormTexts;
  prefill?: ContactPrefill;
  /** Server Action; injetável nos testes. */
  action?: ContactAction;
}

export function ContactForm({ texts, prefill, action }: ContactFormProps) {
  const {
    formAction,
    pending,
    sent,
    error,
    values,
    fieldsKey,
    errorsOf,
    startedAtRef,
    restart,
  } = useContactFormViewModel({ action });
  const { fields } = texts;

  if (sent) {
    return <ContactSuccess {...texts.success} onRestart={restart} />;
  }

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6" noValidate>
          {error ? (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup key={fieldsKey}>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContactTextField
                {...fields.name}
                defaultValue={values?.name}
                errors={errorsOf("name")}
                id="contato-nome"
                name="name"
                required
              />
              <ContactTextField
                {...fields.email}
                defaultValue={values?.email}
                errors={errorsOf("email")}
                id="contato-email"
                inputMode="email"
                name="email"
                required
                type="email"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <ContactTextField
                {...fields.company}
                defaultValue={values?.company}
                errors={errorsOf("company")}
                id="contato-empresa"
                name="company"
              />
              <ContactReasonField
                {...fields.reason}
                defaultValue={values?.reason || prefill?.reason || null}
                errors={errorsOf("reason")}
                service={
                  prefill?.service
                    ? {
                        label: fields.service.label,
                        title: prefill.service.title,
                      }
                    : null
                }
              />
            </div>

            <ContactMessageField
              defaultValue={values?.message}
              errors={errorsOf("message")}
              label={fields.message.label}
            />
          </FieldGroup>

          <HoneypotField label={fields.honeypot.label} />
          <input ref={startedAtRef} name="startedAt" type="hidden" />
          <input
            name="service"
            type="hidden"
            value={prefill?.service?.slug ?? ""}
          />

          <Button
            className="h-11 w-full px-6 sm:w-auto"
            disabled={pending}
            type="submit"
          >
            {pending ? texts.submitting : texts.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
