import "server-only";

import nodemailer from "nodemailer";

import type { EmailMessage } from "./sender";

/** Envio por SMTP (nodemailer). Porta 465 usa TLS direto; outras, STARTTLS. */
export async function sendViaSmtp(message: EmailMessage): Promise<void> {
  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  await transporter.sendMail(message);
}
