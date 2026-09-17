/**
 * Envio da mensagem de contato: rate limit por IP, montagem do e-mail e
 * entrega pelo transporte configurado. Não envia confirmação ao visitante
 * (evita usar o site para mandar e-mail a endereços de terceiros).
 */
import "server-only";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import { buildContactEmail } from "@/lib/email/contact-template";
import {
  getEmailSender,
  resolveTransport,
  type EmailTransport,
} from "@/lib/email/sender";
import { logger } from "@/lib/log/logger";
import { ipPrefix, maskEmail } from "@/lib/log/redact";
import { isRateLimited } from "@/lib/rate-limit";

import { ContactError } from "./errors";
import type { ContactInput } from "./schema";

/** 3 mensagens a cada 10 minutos por IP. */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };

/** Nomes das variáveis que faltam para o transporte escolhido (nunca valores). */
function missingConfig(
  transport: EmailTransport | null,
  env: Record<string, string | undefined>,
): string[] {
  if (!transport) return ["EMAIL_TRANSPORT"];
  if (transport !== "smtp") return [];
  return ["EMAIL_TO", "EMAIL_FROM", "SMTP_HOST"].filter((key) => !env[key]);
}

export async function sendContactMessage(
  input: ContactInput,
  clientIp: string,
): Promise<void> {
  if (
    isRateLimited(`contact:${clientIp}`, RATE_LIMIT.max, RATE_LIMIT.windowMs)
  ) {
    logger.warn("contact.rate_limited", {
      ipPrefix: ipPrefix(clientIp),
      max: RATE_LIMIT.max,
      windowMs: RATE_LIMIT.windowMs,
    });
    throw new ContactError("RATE_LIMITED", contatoMessages.rateLimited);
  }

  const transport = resolveTransport();
  const missing = missingConfig(transport, process.env);
  if (!transport || missing.length > 0) {
    logger.error("contact.not_configured", { transport, missing });
    throw new ContactError("NOT_CONFIGURED", contatoMessages.sendFailed);
  }

  const email = buildContactEmail(input, new Date());
  const startedAt = performance.now();
  const durationMs = () => Math.round(performance.now() - startedAt);
  try {
    const send = await getEmailSender(transport);
    await send({
      from: process.env.EMAIL_FROM ?? "contato@localhost",
      to: process.env.EMAIL_TO ?? "contato@localhost",
      replyTo: input.email,
      ...email,
    });
  } catch (err) {
    logger.error("contact.send_failed", {
      transport,
      durationMs: durationMs(),
      error: err,
    });
    throw new ContactError("SEND_FAILED", contatoMessages.sendFailed);
  }

  logger.info("contact.sent", {
    transport,
    durationMs: durationMs(),
    reason: input.reason,
    service: input.service,
    email: maskEmail(input.email),
    messageLength: input.message.length,
    hasCompany: Boolean(input.company),
  });
}
