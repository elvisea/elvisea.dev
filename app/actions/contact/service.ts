/**
 * Envio da mensagem de contato: rate limit por IP, montagem do e-mail e
 * entrega pelo transporte configurado. Não envia confirmação ao visitante
 * (evita usar o site para mandar e-mail a endereços de terceiros).
 */
import "server-only";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import { buildContactEmail } from "@/lib/email/contact-template";
import { getEmailSender, resolveTransport } from "@/lib/email/sender";
import { isRateLimited } from "@/lib/rate-limit";

import { ContactError } from "./errors";
import type { ContactInput } from "./schema";

/** 3 mensagens a cada 10 minutos por IP. */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };

export async function sendContactMessage(
  input: ContactInput,
  clientIp: string,
): Promise<void> {
  if (
    isRateLimited(`contact:${clientIp}`, RATE_LIMIT.max, RATE_LIMIT.windowMs)
  ) {
    throw new ContactError("RATE_LIMITED", contatoMessages.rateLimited);
  }

  const transport = resolveTransport();
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;
  if (
    !transport ||
    (transport === "smtp" && (!to || !from || !process.env.SMTP_HOST))
  ) {
    console.error("[contact] envio de e-mail não configurado");
    throw new ContactError("NOT_CONFIGURED", contatoMessages.sendFailed);
  }

  const email = buildContactEmail(input, new Date());
  try {
    const send = await getEmailSender(transport);
    await send({
      from: from ?? "contato@localhost",
      to: to ?? "contato@localhost",
      replyTo: input.email,
      ...email,
    });
  } catch (err) {
    console.error("[contact] envio falhou:", err);
    throw new ContactError("SEND_FAILED", contatoMessages.sendFailed);
  }
}
