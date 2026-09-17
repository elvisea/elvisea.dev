import { describe, expect, it } from "bun:test";

import { parseContactPrefill } from "./prefill";

const services = [{ slug: "pagamentos-pix", title: "Pagamentos com PIX" }];

describe("parseContactPrefill", () => {
  it("lê assunto e serviço válidos", () => {
    const params = new URLSearchParams(
      "assunto=projeto&servico=pagamentos-pix",
    );
    expect(parseContactPrefill(params, services)).toEqual({
      reason: "projeto",
      service: services[0]!,
    });
  });

  it("serviço sem assunto seleciona projeto", () => {
    const params = new URLSearchParams("servico=pagamentos-pix");
    expect(parseContactPrefill(params, services).reason).toBe("projeto");
  });

  it("ignora assunto e serviço desconhecidos", () => {
    const params = new URLSearchParams("assunto=spam&servico=nao-existe");
    expect(parseContactPrefill(params, services)).toEqual({
      reason: null,
      service: null,
    });
  });

  it("sem parâmetros, nada é pré-selecionado", () => {
    expect(parseContactPrefill(new URLSearchParams(), services)).toEqual({
      reason: null,
      service: null,
    });
  });
});
