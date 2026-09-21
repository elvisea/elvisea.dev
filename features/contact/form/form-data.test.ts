import { describe, expect, it } from "bun:test";

import { readContactFormData } from "./form-data";

describe("readContactFormData", () => {
  it("lê valores, isca e startedAt", () => {
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

  it("lê o serviço do campo oculto", () => {
    const fd = new FormData();
    fd.set("service", "pagamentos-pix");
    expect(readContactFormData(fd).values.service).toBe("pagamentos-pix");
  });
});
