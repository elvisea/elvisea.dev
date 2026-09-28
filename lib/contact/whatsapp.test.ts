import { describe, expect, it } from "bun:test";

import { whatsappHref } from "./whatsapp";

describe("whatsappHref", () => {
  it("monta o link wa.me só com dígitos", () => {
    expect(whatsappHref("+55 (41) 99219-0528")).toBe(
      "https://wa.me/5541992190528",
    );
  });

  it("codifica a mensagem pré-preenchida", () => {
    expect(whatsappHref("5541992190528", "Olá, Elvis!")).toBe(
      "https://wa.me/5541992190528?text=Ol%C3%A1%2C%20Elvis!",
    );
  });

  it("recusa número sem país e DDD", () => {
    expect(() => whatsappHref("992190528")).toThrow();
  });
});
