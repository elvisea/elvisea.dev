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
import { MIN_FILL_MS } from "@/features/contact/form/anti-spam";
import type { ContactFormData } from "@/features/contact/form/form-data";
import { logger } from "@/lib/log/logger";

import { ContactError } from "./errors";
import {
  mapContactError,
  processContactSubmission,
  type SubmissionDeps,
} from "./process-submission";

const logInfo = spyOn(logger, "info").mockImplementation(() => {});
const logError = spyOn(logger, "error").mockImplementation(() => {});

afterAll(() => {
  mock.restore();
});

const now = 1_700_000_000_000;

function data(
  overrides: Partial<ContactFormData["values"]> = {},
  extra: Partial<ContactFormData> = {},
): ContactFormData {
  return {
    values: {
      name: "Maria Silva",
      email: "maria@example.com",
      company: "ACME",
      reason: "projeto",
      message: "Mensagem com tamanho suficiente para passar.",
      service: "",
      ...overrides,
    },
    honeypot: "",
    startedAt: now - MIN_FILL_MS - 1_000,
    ...extra,
  };
}

function deps(send = mock<SubmissionDeps["send"]>(async () => {})) {
  return { send, clientIp: async () => "1.2.3.4", now };
}

describe("processContactSubmission", () => {
  beforeEach(() => {
    logInfo.mockClear();
    logError.mockClear();
  });

  it("envia quando os dados são válidos, com o IP do cliente", async () => {
    const d = deps();
    expect(await processContactSubmission(data(), d)).toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledTimes(1);
    expect(d.send.mock.calls[0]?.[1]).toBe("1.2.3.4");
  });

  it("isca preenchida: sucesso falso, sem envio, com o evento", async () => {
    const d = deps();
    const result = await processContactSubmission(
      data({}, { honeypot: "http://x" }),
      d,
    );
    expect(result).toEqual({ ok: true });
    expect(d.send).not.toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("contact.rejected.honeypot");
  });

  it("formulário vazio enviado na hora: mostra erros, nunca sucesso", async () => {
    const d = deps();
    const result = await processContactSubmission(
      {
        values: {
          name: "",
          email: "",
          company: "",
          reason: "",
          message: "",
          service: "",
        },
        honeypot: "",
        startedAt: now,
      },
      d,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(contatoMessages.validationSummary);
      expect(Object.keys(result.fieldErrors ?? {})).toEqual(
        expect.arrayContaining(["name", "email", "reason", "message"]),
      );
    }
    expect(d.send).not.toHaveBeenCalled();
  });

  it("válido e rápido demais: sucesso falso, sem envio", async () => {
    const d = deps();
    const result = await processContactSubmission(
      data({}, { startedAt: now - 500 }),
      d,
    );
    expect(result).toEqual({ ok: true });
    expect(d.send).not.toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("contact.rejected.too_fast", {
      elapsedMs: 500,
    });
  });

  it("válido sem startedAt (sem JavaScript): envia", async () => {
    const d = deps();
    expect(
      await processContactSubmission(data({}, { startedAt: null }), d),
    ).toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledTimes(1);
  });

  it("validação: erros por campo e valores digitados, sem valores no log", async () => {
    const d = deps();
    const result = await processContactSubmission(
      data({ email: "invalido", message: "curta" }),
      d,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors ?? {})).toEqual(
        expect.arrayContaining(["email", "message"]),
      );
      expect(result.values?.email).toBe("invalido");
    }
    const call = logInfo.mock.calls.find(
      ([event]) => event === "contact.validation_failed",
    ) as [string, { fields: string[] }] | undefined;
    expect(call?.[1].fields).toEqual(
      expect.arrayContaining(["email", "message"]),
    );
    expect(JSON.stringify(call)).not.toContain("invalido");
  });

  it("repassa a mensagem de ContactError e mantém os valores", async () => {
    const d = deps(
      mock<SubmissionDeps["send"]>(async () => {
        throw new ContactError("RATE_LIMITED", contatoMessages.rateLimited);
      }),
    );
    const result = await processContactSubmission(data(), d);
    expect(result).toMatchObject({
      ok: false,
      error: contatoMessages.rateLimited,
      values: { name: "Maria Silva" },
    });
    expect(logError).not.toHaveBeenCalled();
  });

  it("erro inesperado vira mensagem genérica e é registrado", async () => {
    const d = deps(
      mock<SubmissionDeps["send"]>(async () => {
        throw new Error("boom");
      }),
    );
    const result = await processContactSubmission(data(), d);
    expect(result).toMatchObject({
      ok: false,
      error: contatoMessages.sendFailed,
    });
    expect(logError).toHaveBeenCalledWith(
      "contact.unexpected_error",
      expect.objectContaining({ error: expect.any(Error) }),
    );
  });
});

describe("mapContactError", () => {
  it("ContactError mantém a mensagem; o resto vira falha genérica", () => {
    expect(mapContactError(new ContactError("SEND_FAILED", "x"))).toEqual({
      message: "x",
      unexpected: false,
    });
    expect(mapContactError(new Error("boom"))).toEqual({
      message: contatoMessages.sendFailed,
      unexpected: true,
    });
  });
});
