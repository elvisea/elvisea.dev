import { describe, expect, it } from "bun:test";

import { contactSchema, readContactFormData } from "./schema";

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

describe("readContactFormData", () => {
  it("lê valores, honeypot e startedAt", () => {
    const fd = new FormData();
    fd.set("name", "Ana");
    fd.set("website", "http://spam");
    fd.set("startedAt", "1700000000000");
    const data = readContactFormData(fd);
    expect(data.values.name).toBe("Ana");
    expect(data.values.email).toBe("");
    expect(data.honeypot).toBe("http://spam");
    expect(data.startedAt).toBe(1700000000000);
  });

  it("startedAt inválido vira null", () => {
    const fd = new FormData();
    fd.set("startedAt", "abc");
    expect(readContactFormData(fd).startedAt).toBeNull();
  });
});
