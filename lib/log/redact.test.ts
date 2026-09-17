import { describe, expect, it } from "bun:test";

import { ipPrefix, maskEmail } from "./redact";

describe("maskEmail", () => {
  it("mantém só a primeira letra e o domínio", () => {
    expect(maskEmail("maria@example.com")).toBe("m***@example.com");
  });

  it("valor sem @ vira ***", () => {
    expect(maskEmail("invalido")).toBe("***");
    expect(maskEmail("@example.com")).toBe("***");
  });
});

describe("ipPrefix", () => {
  it("IPv4 vira /24", () => {
    expect(ipPrefix("203.0.113.42")).toBe("203.0.113.0/24");
  });

  it("IPv6 vira /48", () => {
    expect(ipPrefix("2001:db8:85a3:8d3:1319:8a2e:370:7348")).toBe(
      "2001:db8:85a3::/48",
    );
  });

  it("valor desconhecido vira unknown", () => {
    expect(ipPrefix("unknown")).toBe("unknown");
    expect(ipPrefix("")).toBe("unknown");
  });
});
