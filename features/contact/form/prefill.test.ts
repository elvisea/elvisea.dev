import { describe, expect, it } from "bun:test";

import { parseContactPrefill } from "./prefill";

const options = {
  reasons: ["vaga", "projeto", "outro"],
  services: [{ slug: "pagamentos-pix", title: "Pagamentos com PIX" }],
};

describe("parseContactPrefill", () => {
  it("lê assunto e serviço válidos", () => {
    const params = new URLSearchParams(
      "assunto=projeto&servico=pagamentos-pix",
    );
    expect(parseContactPrefill(params, options)).toEqual({
      reason: "projeto",
      service: options.services[0]!,
    });
  });

  it("serviço sem assunto seleciona projeto", () => {
    const params = new URLSearchParams("servico=pagamentos-pix");
    expect(parseContactPrefill(params, options).reason).toBe("projeto");
  });

  it("assunto válido vence o padrão do serviço", () => {
    const params = new URLSearchParams("assunto=vaga&servico=pagamentos-pix");
    expect(parseContactPrefill(params, options).reason).toBe("vaga");
  });

  it("ignora assunto e serviço desconhecidos", () => {
    const params = new URLSearchParams("assunto=spam&servico=nao-existe");
    expect(parseContactPrefill(params, options)).toEqual({
      reason: null,
      service: null,
    });
  });

  it("sem parâmetros, nada é pré-selecionado", () => {
    expect(parseContactPrefill(new URLSearchParams(), options)).toEqual({
      reason: null,
      service: null,
    });
  });
});
