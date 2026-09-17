import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
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
  it("com transporte console, registra no log sem erro", async () => {
    process.env.EMAIL_TRANSPORT = "console";
    const info = spyOn(console, "info").mockImplementation(() => {});
    await sendContactMessage(input, "1.1.1.1");
    expect(info).toHaveBeenCalledTimes(1);
    const [, payload] = info.mock.calls[0] as [string, { replyTo: string }];
    expect(payload.replyTo).toBe(input.email);
    info.mockRestore();
  });

  it("aplica rate limit por IP (3 envios)", async () => {
    process.env.EMAIL_TRANSPORT = "console";
    const info = spyOn(console, "info").mockImplementation(() => {});
    for (let i = 0; i < 3; i++) await sendContactMessage(input, "2.2.2.2");
    await expect(sendContactMessage(input, "2.2.2.2")).rejects.toMatchObject({
      code: "RATE_LIMITED",
      message: contatoMessages.rateLimited,
    });
    await sendContactMessage(input, "3.3.3.3");
    info.mockRestore();
  });

  it("smtp sem configuração: NOT_CONFIGURED", async () => {
    process.env.EMAIL_TRANSPORT = "smtp";
    delete process.env.SMTP_HOST;
    delete process.env.EMAIL_TO;
    const error = spyOn(console, "error").mockImplementation(() => {});
    let err: unknown;
    try {
      await sendContactMessage(input, "4.4.4.4");
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(ContactError);
    expect((err as ContactError).code).toBe("NOT_CONFIGURED");
    error.mockRestore();
  });
});
