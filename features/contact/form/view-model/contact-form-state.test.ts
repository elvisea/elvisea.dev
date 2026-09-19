import { describe, expect, it } from "bun:test";

import { fieldErrorsOf, fieldsKeyOf } from "./contact-form-state";

const values = {
  name: "Ana",
  email: "x",
  company: "",
  reason: "vaga",
  message: "curta",
  service: "",
};

describe("fieldErrorsOf", () => {
  it("sem estado ou com sucesso, não há erro", () => {
    expect(fieldErrorsOf(null, "email")).toBeUndefined();
    expect(fieldErrorsOf({ ok: true }, "email")).toBeUndefined();
  });

  it("converte as mensagens do campo para o FieldError", () => {
    const state = {
      ok: false as const,
      error: "Revise",
      fieldErrors: { email: ["Informe um e-mail válido."] },
    };
    expect(fieldErrorsOf(state, "email")).toEqual([
      { message: "Informe um e-mail válido." },
    ]);
    expect(fieldErrorsOf(state, "name")).toBeUndefined();
  });
});

describe("fieldsKeyOf", () => {
  it("é estável até a action devolver valores digitados", () => {
    expect(fieldsKeyOf(null)).toBe("inicial");
    expect(fieldsKeyOf({ ok: false, error: "x" })).toBe("inicial");
    expect(fieldsKeyOf({ ok: false, error: "x", values })).toBe(
      JSON.stringify(values),
    );
  });
});
