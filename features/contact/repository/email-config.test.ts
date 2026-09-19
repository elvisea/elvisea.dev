import { describe, expect, it } from "bun:test";

import { resolveEmailConfig } from "./email-config";

describe("resolveEmailConfig", () => {
  it("console fora de produção, com remetente e destino locais", () => {
    expect(resolveEmailConfig({ NODE_ENV: "development" })).toEqual({
      ok: true,
      transport: "console",
      from: "contato@localhost",
      to: "contato@localhost",
    });
  });

  it("smtp completo usa EMAIL_FROM e EMAIL_TO", () => {
    expect(
      resolveEmailConfig({
        EMAIL_TRANSPORT: "smtp",
        EMAIL_FROM: "site@example.com",
        EMAIL_TO: "eu@example.com",
        SMTP_HOST: "smtp.example.com",
      }),
    ).toEqual({
      ok: true,
      transport: "smtp",
      from: "site@example.com",
      to: "eu@example.com",
    });
  });

  it("smtp incompleto lista só os nomes que faltam", () => {
    expect(
      resolveEmailConfig({
        EMAIL_TRANSPORT: "smtp",
        EMAIL_FROM: "site@example.com",
      }),
    ).toEqual({
      ok: false,
      transport: "smtp",
      missing: ["EMAIL_TO", "SMTP_HOST"],
    });
  });

  it("produção sem transporte definido não envia", () => {
    expect(resolveEmailConfig({ NODE_ENV: "production" })).toEqual({
      ok: false,
      transport: null,
      missing: ["EMAIL_TRANSPORT"],
    });
  });
});
