/** Configuração do e-mail de contato a partir das variáveis de ambiente. */
import { type EmailTransport, resolveTransport } from "@/lib/email/sender";

export type EmailConfig =
  | { ok: true; transport: EmailTransport; from: string; to: string }
  | {
      ok: false;
      transport: EmailTransport | null;
      /** Nomes das variáveis que faltam (nunca os valores). */
      missing: string[];
    };

export function resolveEmailConfig(
  env: Record<string, string | undefined>,
): EmailConfig {
  const transport = resolveTransport(env);
  if (!transport) return { ok: false, transport, missing: ["EMAIL_TRANSPORT"] };

  const missing =
    transport === "smtp"
      ? ["EMAIL_TO", "EMAIL_FROM", "SMTP_HOST"].filter((key) => !env[key])
      : [];
  if (missing.length > 0) return { ok: false, transport, missing };

  return {
    ok: true,
    transport,
    from: env.EMAIL_FROM ?? "contato@localhost",
    to: env.EMAIL_TO ?? "contato@localhost",
  };
}
