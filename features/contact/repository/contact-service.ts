/**
 * Envio da mensagem de contato: rate limit por IP, configuração, montagem do
 * e-mail e entrega pelo transporte configurado. Não envia confirmação ao
 * visitante (evita usar o site para mandar e-mail a endereços de terceiros).
 *
 * As dependências (ambiente, rate limit, remetente, relógio) entram por
 * parâmetro para os testes não dependerem de variáveis globais nem do tempo.
 */
import "server-only";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import type { ContactInput } from "@/features/contact/form/validations";
import {
  getEmailSender,
  type EmailSender,
  type EmailTransport,
} from "@/lib/email/sender";
import { logger } from "@/lib/log/logger";
import { ipPrefix, maskEmail } from "@/lib/log/redact";
import { isRateLimited } from "@/lib/rate-limit";

import { buildContactEmail } from "./contact-email";
import { resolveEmailConfig } from "./email-config";
import { ContactError } from "./errors";

/** 3 mensagens a cada 10 minutos por IP. */
export const RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };

export interface ContactServiceDeps {
  env: Record<string, string | undefined>;
  isRateLimited: (key: string, max: number, windowMs: number) => boolean;
  getSender: (
    transport: EmailTransport,
    env: Record<string, string | undefined>,
  ) => Promise<EmailSender>;
  /** Data de recebimento, que aparece no e-mail. */
  now: () => Date;
  /** Relógio de alta resolução, para medir a duração do envio. */
  elapsed: () => number;
}

export const defaultContactServiceDeps: ContactServiceDeps = {
  env: process.env,
  isRateLimited,
  getSender: getEmailSender,
  now: () => new Date(),
  elapsed: () => performance.now(),
};

export async function sendContactMessage(
  input: ContactInput,
  clientIp: string,
  deps: ContactServiceDeps = defaultContactServiceDeps,
): Promise<void> {
  if (
    deps.isRateLimited(
      `contact:${clientIp}`,
      RATE_LIMIT.max,
      RATE_LIMIT.windowMs,
    )
  ) {
    logger.warn("contact.rate_limited", {
      ipPrefix: ipPrefix(clientIp),
      max: RATE_LIMIT.max,
      windowMs: RATE_LIMIT.windowMs,
    });
    throw new ContactError("RATE_LIMITED", contatoMessages.rateLimited);
  }

  const config = resolveEmailConfig(deps.env);
  if (!config.ok) {
    logger.error("contact.not_configured", {
      transport: config.transport,
      missing: config.missing,
    });
    throw new ContactError("NOT_CONFIGURED", contatoMessages.sendFailed);
  }

  const { transport } = config;
  const email = buildContactEmail(input, deps.now());
  const startedAt = deps.elapsed();
  const durationMs = () => Math.round(deps.elapsed() - startedAt);
  try {
    const send = await deps.getSender(transport, deps.env);
    await send({
      from: config.from,
      to: config.to,
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
