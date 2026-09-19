import { afterAll, describe, expect, it, mock, spyOn } from "bun:test";

import { logger } from "@/lib/log/logger";

import { getEmailSender, resolveTransport } from "./sender";

describe("resolveTransport", () => {
  it("respeita EMAIL_TRANSPORT válido", () => {
    expect(resolveTransport({ EMAIL_TRANSPORT: "smtp" })).toBe("smtp");
    expect(resolveTransport({ EMAIL_TRANSPORT: "console" })).toBe("console");
  });

  it("usa console fora de produção quando não definido", () => {
    expect(resolveTransport({ NODE_ENV: "development" })).toBe("console");
  });

  it("em produção sem definição, ou com valor desconhecido, não envia", () => {
    expect(resolveTransport({ NODE_ENV: "production" })).toBeNull();
    expect(resolveTransport({ EMAIL_TRANSPORT: "carrier-pigeon" })).toBeNull();
  });
});

describe("getEmailSender (console)", () => {
  const info = spyOn(logger, "info").mockImplementation(() => {});
  afterAll(() => {
    mock.restore();
  });

  const message = {
    from: "site@example.com",
    to: "eu@example.com",
    replyTo: "maria@example.com",
    subject: "Assunto com nome",
    text: "Texto da mensagem",
    html: "<p>Texto</p>",
  };

  it("fora de produção, registra assunto e texto, com o e-mail mascarado", async () => {
    info.mockClear();
    await (
      await getEmailSender("console", { NODE_ENV: "development" })
    )(message);
    expect(info).toHaveBeenCalledWith("email.console", {
      to: "eu@example.com",
      replyTo: "m***@example.com",
      subject: "Assunto com nome",
      text: "Texto da mensagem",
    });
  });

  it("em produção, registra só o tamanho do texto", async () => {
    info.mockClear();
    await (
      await getEmailSender("console", { NODE_ENV: "production" })
    )(message);
    const [, fields] = info.mock.calls[0] as [string, Record<string, unknown>];
    expect(fields).not.toHaveProperty("text");
    expect(fields).not.toHaveProperty("subject");
    expect(fields.textLength).toBe(message.text.length);
  });
});
