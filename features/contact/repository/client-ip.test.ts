import { describe, expect, it } from "bun:test";

import { getClientIp } from "./client-ip";

describe("getClientIp", () => {
  it("usa o primeiro valor de x-forwarded-for por padrão", () => {
    const headers = new Headers({ "x-forwarded-for": " 1.2.3.4 , 10.0.0.1" });
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("lê o header confiável configurado", () => {
    const headers = new Headers({
      "cf-connecting-ip": "5.6.7.8",
      "x-forwarded-for": "9.9.9.9",
    });
    expect(getClientIp(headers, "cf-connecting-ip")).toBe("5.6.7.8");
  });

  it("sem o header, devolve unknown", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
    expect(getClientIp(new Headers({ "x-forwarded-for": " " }))).toBe(
      "unknown",
    );
  });
});
