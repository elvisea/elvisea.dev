import { describe, expect, it } from "bun:test";

import { contactSchema, fieldErrorsFromIssues } from "./validations";

const valid = {
  name: "Maria Silva",
  email: "maria@example.com",
  company: "",
  reason: "vaga",
  message: "Olá, gostaria de conversar sobre uma vaga de backend.",
};

describe("contactSchema", () => {
  it("aceita dados válidos e transforma empresa vazia em undefined", () => {
    const parsed = contactSchema.parse(valid);
    expect(parsed.company).toBeUndefined();
    expect(parsed.reason).toBe("vaga");
  });

  it("rejeita e-mail inválido, assunto fora da lista e mensagem curta", () => {
    const result = contactSchema.safeParse({
      ...valid,
      email: "nao-e-email",
      reason: "spam",
      message: "curta",
    });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(
      expect.arrayContaining(["email", "reason", "message"]),
    );
  });
});

describe("serviço de origem", () => {
  it("aceita slug existente e descarta vazio ou desconhecido", () => {
    expect(
      contactSchema.parse({ ...valid, service: "pagamentos-pix" }).service,
    ).toBe("pagamentos-pix");
    expect(
      contactSchema.parse({ ...valid, service: "" }).service,
    ).toBeUndefined();
    const unknown = contactSchema.safeParse({
      ...valid,
      service: "nao-existe",
    });
    expect(unknown.success).toBe(true);
    expect(unknown.data?.service).toBeUndefined();
  });
});

describe("fieldErrorsFromIssues", () => {
  it("agrupa as mensagens pelo primeiro nível do caminho", () => {
    expect(
      fieldErrorsFromIssues([
        { path: ["email"], message: "a" },
        { path: ["email"], message: "b" },
        { path: ["message"], message: "c" },
      ]),
    ).toEqual({ email: ["a", "b"], message: ["c"] });
  });

  it("erro sem campo vai para `form`", () => {
    expect(fieldErrorsFromIssues([{ path: [], message: "x" }])).toEqual({
      form: ["x"],
    });
  });
});
