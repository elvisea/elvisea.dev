import { describe, expect, it, mock } from "bun:test";

import type { EmailMessage } from "./sender";
import { createSmtpSender, smtpConfigFromEnv } from "./smtp";

const message: EmailMessage = {
  from: "site@example.com",
  to: "eu@example.com",
  subject: "Assunto",
  text: "texto",
  html: "<p>texto</p>",
};

describe("smtpConfigFromEnv", () => {
  it("lê as variáveis SMTP_* e usa a porta 465 por padrão", () => {
    expect(
      smtpConfigFromEnv({
        SMTP_HOST: "smtp.x",
        SMTP_USER: "u",
        SMTP_PASSWORD: "p",
      }),
    ).toEqual({ host: "smtp.x", port: 465, user: "u", password: "p" });
    expect(smtpConfigFromEnv({ SMTP_PORT: "587" }).port).toBe(587);
  });
});

describe("createSmtpSender", () => {
  function fakeTransport() {
    const sendMail = mock<(message: EmailMessage) => Promise<unknown>>(
      async () => ({}),
    );
    const createTransport = mock<
      (options: object) => { sendMail: typeof sendMail }
    >(() => ({ sendMail }));
    return { sendMail, createTransport };
  }

  it("porta 465: TLS direto, com as credenciais e a mensagem inteira", async () => {
    const { sendMail, createTransport } = fakeTransport();
    const send = createSmtpSender(
      { host: "smtp.x", port: 465, user: "u", password: "p" },
      createTransport,
    );
    await send(message);
    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp.x",
      port: 465,
      secure: true,
      auth: { user: "u", pass: "p" },
    });
    expect(sendMail).toHaveBeenCalledWith(message);
  });

  it("outra porta: STARTTLS (secure false)", async () => {
    const { createTransport } = fakeTransport();
    await createSmtpSender(
      { host: "smtp.x", port: 587, user: "u", password: "p" },
      createTransport,
    )(message);
    expect(createTransport.mock.calls[0]?.[0]).toMatchObject({ secure: false });
  });

  it("propaga a falha do servidor SMTP", async () => {
    const createTransport = () => ({
      sendMail: async () => {
        throw new Error("535 auth");
      },
    });
    const send = createSmtpSender(
      { host: "smtp.x", port: 465, user: "u", password: "p" },
      createTransport,
    );
    await expect(send(message)).rejects.toThrow("535 auth");
  });
});
