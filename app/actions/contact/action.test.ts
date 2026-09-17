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

import { submitContact } from "./action";
import { ContactError } from "./errors";
import { MIN_FILL_MS } from "./schema";
import * as service from "./service";

// spyOn (e não mock.module): é desfeito por mock.restore() e não vaza para
// os outros arquivos de teste.
const sendContactMessage = spyOn(service, "sendContactMessage");

afterAll(() => {
  mock.restore();
});

function form(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const fields = {
    name: "Maria Silva",
    email: "maria@example.com",
    company: "ACME",
    reason: "projeto",
    message: "Mensagem com tamanho suficiente para passar.",
    startedAt: String(Date.now() - MIN_FILL_MS - 1_000),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

describe("submitContact", () => {
  beforeEach(() => {
    sendContactMessage.mockReset();
    sendContactMessage.mockImplementation(() => Promise.resolve());
  });

  it("envia quando os dados são válidos", async () => {
    expect(await submitContact(null, form())).toEqual({ ok: true });
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it("honeypot preenchido: responde sucesso e não envia", async () => {
    const result = await submitContact(null, form({ website: "http://x" }));
    expect(result).toEqual({ ok: true });
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("formulário vazio enviado na hora: mostra erros, nunca sucesso", async () => {
    const empty = new FormData();
    empty.set("startedAt", String(Date.now()));
    const result = await submitContact(null, empty);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(contatoMessages.validationSummary);
      expect(Object.keys(result.fieldErrors ?? {})).toEqual(
        expect.arrayContaining(["name", "email", "reason", "message"]),
      );
    }
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("formulário vazio sem startedAt: mostra erros", async () => {
    const result = await submitContact(null, new FormData());
    expect(result.ok).toBe(false);
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("formulário válido preenchido rápido demais: sucesso falso, sem envio", async () => {
    const result = await submitContact(
      null,
      form({ startedAt: String(Date.now()) }),
    );
    expect(result).toEqual({ ok: true });
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("formulário válido sem startedAt (sem JavaScript): envia", async () => {
    expect(await submitContact(null, form({ startedAt: "" }))).toEqual({
      ok: true,
    });
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it("validação: devolve erros por campo e os valores digitados", async () => {
    const result = await submitContact(
      null,
      form({ email: "invalido", message: "curta" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(contatoMessages.validationSummary);
      expect(Object.keys(result.fieldErrors ?? {})).toEqual(
        expect.arrayContaining(["email", "message"]),
      );
      expect(result.values?.email).toBe("invalido");
    }
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("repassa a mensagem de ContactError do service", async () => {
    sendContactMessage.mockImplementationOnce(() =>
      Promise.reject(
        new ContactError("RATE_LIMITED", contatoMessages.rateLimited),
      ),
    );
    const result = await submitContact(null, form());
    expect(result).toMatchObject({
      ok: false,
      error: contatoMessages.rateLimited,
    });
  });

  it("erro inesperado vira mensagem genérica", async () => {
    sendContactMessage.mockImplementationOnce(() =>
      Promise.reject(new Error("boom")),
    );
    const error = spyOn(console, "error").mockImplementation(() => {});
    const result = await submitContact(null, form());
    error.mockRestore();
    expect(result).toMatchObject({
      ok: false,
      error: contatoMessages.sendFailed,
    });
  });
});
