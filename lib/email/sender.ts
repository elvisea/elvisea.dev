/**
 * Envio de e-mail plugável, escolhido por `EMAIL_TRANSPORT`:
 *
 * - `console`: só registra no log (padrão fora de produção).
 * - `smtp`: nodemailer, com `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
 *   `SMTP_PASSWORD`.
 *
 * Outro provedor (ex.: API HTTP, necessária em Cloudflare Workers) entra como
 * mais um caso aqui, sem mudar o formulário.
 */
import "server-only";

import { logger } from "@/lib/log/logger";
import { maskEmail } from "@/lib/log/redact";

export interface EmailMessage {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export type EmailSender = (message: EmailMessage) => Promise<void>;

export type EmailTransport = "console" | "smtp";

export function resolveTransport(
  env: Record<string, string | undefined> = process.env,
): EmailTransport | null {
  const value = env.EMAIL_TRANSPORT;
  if (value === "console" || value === "smtp") return value;
  if (value) return null;
  return env.NODE_ENV === "production" ? null : "console";
}

export async function getEmailSender(
  transport: EmailTransport,
): Promise<EmailSender> {
  if (transport === "smtp") {
    const { sendViaSmtp } = await import("./smtp");
    return sendViaSmtp;
  }
  return async (message) => {
    // Assunto e texto trazem nome e mensagem: só fora de produção.
    const production = process.env.NODE_ENV === "production";
    logger.info("email.console", {
      to: message.to,
      replyTo: message.replyTo ? maskEmail(message.replyTo) : undefined,
      ...(production
        ? { textLength: message.text.length }
        : { subject: message.subject, text: message.text }),
    });
  };
}
