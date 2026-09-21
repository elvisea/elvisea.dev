import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";

import { contatoMessages } from "@/content/pt-BR/pages/contato";
import type { ContactInput } from "@/features/contact/form/validations";
import type { EmailMessage } from "@/lib/email/sender";
import { logger } from "@/lib/log/logger";

import {
  type ContactServiceDeps,
  RATE_LIMIT,
  sendContactMessage,
} from "./contact-service";
import { ContactError } from "./errors";

const input: ContactInput = {
  name: "Maria Silva",
  email: "maria@example.com",
  company: undefined,
  reason: "vaga",
  message: "Mensagem com tamanho suficiente para passar.",
};

const info = spyOn(logger, "info").mockImplementation(() => {});
const warn = spyOn(logger, "warn").mockImplementation(() => {});
const error = spyOn(logger, "error").mockImplementation(() => {});

afterAll(() => {
  mock.restore();
});

/** Dependências falsas: sem variáveis globais, relógio fixo, envio em memória. */
function deps(overrides: Partial<ContactServiceDeps> = {}) {
  const sent: EmailMessage[] = [];
  let clock = 0;
  const value: ContactServiceDeps = {
    env: { EMAIL_TRANSPORT: "console" },
    isRateLimited: () => false,
    getSender: async () => async (message) => {
      sent.push(message);
    },
    now: () => new Date("2026-09-17T12:00:00Z"),
    elapsed: () => (clock += 40),
    ...overrides,
  };
  return { deps: value, sent };
}

async function failure(promise: Promise<void>): Promise<ContactError> {
  try {
    await promise;
  } catch (err) {
    return err as ContactError;
  }
  throw new Error("esperava falha");
}

describe("sendContactMessage", () => {
  beforeEach(() => {
    info.mockClear();
    warn.mockClear();
    error.mockClear();
  });

  it("envia para o destino configurado, com resposta para o visitante", async () => {
    const { deps: d, sent } = deps({
      env: {
        EMAIL_TRANSPORT: "smtp",
        EMAIL_FROM: "site@example.com",
        EMAIL_TO: "eu@example.com",
        SMTP_HOST: "smtp.example.com",
      },
    });
    await sendContactMessage(input, "1.1.1.1", d);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      from: "site@example.com",
      to: "eu@example.com",
      replyTo: "maria@example.com",
    });
    expect(sent[0]?.text).toContain("Mensagem com tamanho suficiente");
  });

  it("registra contact.sent com a duração e sem dados pessoais", async () => {
    const { deps: d } = deps();
    await sendContactMessage(input, "1.1.1.1", d);
    const [event, fields] = info.mock.calls.at(-1) as [
      string,
      Record<string, unknown>,
    ];
    expect(event).toBe("contact.sent");
    expect(fields).toMatchObject({
      transport: "console",
      durationMs: 40,
      reason: "vaga",
      email: "m***@example.com",
      messageLength: input.message.length,
      hasCompany: false,
    });
    expect(JSON.stringify(fields)).not.toContain("Maria");
  });

  it("rate limit por IP: RATE_LIMITED e prefixo do IP no log", async () => {
    const isRateLimited = mock(() => true);
    const { deps: d, sent } = deps({ isRateLimited });
    const err = await failure(sendContactMessage(input, "2.2.2.2", d));
    expect(isRateLimited).toHaveBeenCalledWith(
      "contact:2.2.2.2",
      RATE_LIMIT.max,
      RATE_LIMIT.windowMs,
    );
    expect(err).toBeInstanceOf(ContactError);
    expect(err.code).toBe("RATE_LIMITED");
    expect(err.message).toBe(contatoMessages.rateLimited);
    expect(warn).toHaveBeenCalledWith(
      "contact.rate_limited",
      expect.objectContaining({ ipPrefix: "2.2.2.0/24" }),
    );
    expect(sent).toHaveLength(0);
  });

  it("smtp sem configuração: NOT_CONFIGURED com os nomes das variáveis que faltam", async () => {
    const { deps: d, sent } = deps({
      env: { EMAIL_TRANSPORT: "smtp", EMAIL_FROM: "site@example.com" },
    });
    const err = await failure(sendContactMessage(input, "4.4.4.4", d));
    expect(err.code).toBe("NOT_CONFIGURED");
    expect(error).toHaveBeenCalledWith("contact.not_configured", {
      transport: "smtp",
      missing: ["EMAIL_TO", "SMTP_HOST"],
    });
    expect(sent).toHaveLength(0);
  });

  it("falha no envio: SEND_FAILED e contact.send_failed com o erro", async () => {
    const { deps: d } = deps({
      getSender: async () => async () => {
        throw new Error("535 auth");
      },
    });
    const err = await failure(sendContactMessage(input, "5.5.5.5", d));
    expect(err.code).toBe("SEND_FAILED");
    expect(err.message).toBe(contatoMessages.sendFailed);
    expect(error).toHaveBeenCalledWith(
      "contact.send_failed",
      expect.objectContaining({
        transport: "console",
        error: expect.any(Error),
      }),
    );
  });
});
