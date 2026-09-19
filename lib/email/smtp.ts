import "server-only";

import nodemailer from "nodemailer";

import type { EmailMessage, EmailSender } from "./sender";

export interface SmtpConfig {
  host: string | undefined;
  port: number;
  user: string | undefined;
  password: string | undefined;
}

/** Configuração do SMTP a partir das variáveis `SMTP_*` (porta padrão 465). */
export function smtpConfigFromEnv(
  env: Record<string, string | undefined>,
): SmtpConfig {
  return {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 465),
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  };
}

type CreateTransport = (options: {
  host: string | undefined;
  port: number;
  secure: boolean;
  auth: { user: string | undefined; pass: string | undefined };
}) => { sendMail: (message: EmailMessage) => Promise<unknown> };

/**
 * Envio por SMTP (nodemailer). Porta 465 usa TLS direto; outras, STARTTLS.
 * `createTransport` é injetável para testar sem rede.
 */
export function createSmtpSender(
  config: SmtpConfig,
  createTransport: CreateTransport = nodemailer.createTransport,
): EmailSender {
  return async (message) => {
    const transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.password },
    });
    await transporter.sendMail(message);
  };
}
