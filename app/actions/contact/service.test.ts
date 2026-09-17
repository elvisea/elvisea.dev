import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import { logger } from "@/lib/log/logger";
import { resetRateLimitForTests } from "@/lib/rate-limit";

import { ContactError } from "./errors";
import type { ContactInput } from "./schema";
import { sendContactMessage } from "./service";

const input: ContactInput = {
  name: "Maria Silva",
  email: "maria@example.com",
  company: undefined,
  reason: "vaga",
  message: "Mensagem com tamanho suficiente para passar.",
};

const ENV_KEYS = [
  "EMAIL_TRANSPORT",
  "EMAIL_TO",
  "EMAIL_FROM",
  "SMTP_HOST",
  "NODE_ENV",
] as const;
const saved: Record<string, string | undefined> = {};
// process.env tipa NODE_ENV como somente leitura; nos testes precisamos trocá-lo.
const env = process.env as Record<string, string | undefined>;

/** Nomes dos eventos registrados por um spy do logger. */
function events(spy: { mock: { calls: unknown[][] } }): unknown[] {
  return spy.mock.calls.map((call) => call[0]);
}

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = env[key];
  resetRateLimitForTests();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete env[key];
    else env[key] = saved[key];
  }
});

describe("sendContactMessage", () => {
  it("com transporte console, registra email.console e contact.sent sem dados pessoais", async () => {
    env.EMAIL_TRANSPORT = "console";
    const info = spyOn(logger, "info").mockImplementation(() => {});
    await sendContactMessage(input, "1.1.1.1");

    expect(events(info)).toEqual(["email.console", "contact.sent"]);
    const [, emailFields] = info.mock.calls[0] as [string, { replyTo: string }];
    expect(emailFields.replyTo).toBe("m***@example.com");
    const [, sent] = info.mock.calls[1] as [string, Record<string, unknown>];
    expect(sent).toMatchObject({
      transport: "console",
      reason: "vaga",
      email: "m***@example.com",
      messageLength: input.message.length,
      hasCompany: false,
    });
    expect(JSON.stringify(sent)).not.toContain("Maria");
    info.mockRestore();
  });

  it("em produção, email.console não registra assunto nem texto", async () => {
    env.EMAIL_TRANSPORT = "console";
    env.NODE_ENV = "production";
    const info = spyOn(logger, "info").mockImplementation(() => {});
    await sendContactMessage(input, "1.1.1.9");
    const [, emailFields] = info.mock.calls[0] as [
      string,
      Record<string, unknown>,
    ];
    expect(emailFields).not.toHaveProperty("text");
    expect(emailFields).not.toHaveProperty("subject");
    expect(emailFields.textLength).toBeNumber();
    info.mockRestore();
  });

  it("aplica rate limit por IP (3 envios) e registra o prefixo do IP", async () => {
    env.EMAIL_TRANSPORT = "console";
    const info = spyOn(logger, "info").mockImplementation(() => {});
    const warn = spyOn(logger, "warn").mockImplementation(() => {});
    for (let i = 0; i < 3; i++) await sendContactMessage(input, "2.2.2.2");
    await expect(sendContactMessage(input, "2.2.2.2")).rejects.toMatchObject({
      code: "RATE_LIMITED",
      message: contatoMessages.rateLimited,
    });
    expect(warn).toHaveBeenCalledWith(
      "contact.rate_limited",
      expect.objectContaining({ ipPrefix: "2.2.2.0/24" }),
    );
    await sendContactMessage(input, "3.3.3.3");
    info.mockRestore();
    warn.mockRestore();
  });

  it("smtp sem configuração: NOT_CONFIGURED com os nomes das variáveis que faltam", async () => {
    env.EMAIL_TRANSPORT = "smtp";
    delete env.SMTP_HOST;
    delete env.EMAIL_TO;
    env.EMAIL_FROM = "site@example.com";
    const error = spyOn(logger, "error").mockImplementation(() => {});
    let err: unknown;
    try {
      await sendContactMessage(input, "4.4.4.4");
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(ContactError);
    expect((err as ContactError).code).toBe("NOT_CONFIGURED");
    expect(error).toHaveBeenCalledWith("contact.not_configured", {
      transport: "smtp",
      missing: ["EMAIL_TO", "SMTP_HOST"],
    });
    error.mockRestore();
  });
});
