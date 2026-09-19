import { describe, expect, it } from "bun:test";

import { contactHrefFor } from "./routes";

describe("contactHrefFor", () => {
  it("leva ao contato com o assunto projeto", () => {
    expect(contactHrefFor()).toBe("/contato?assunto=projeto");
  });

  it("acrescenta o serviço de origem", () => {
    expect(contactHrefFor("pagamentos-pix")).toBe(
      "/contato?assunto=projeto&servico=pagamentos-pix",
    );
  });
});
