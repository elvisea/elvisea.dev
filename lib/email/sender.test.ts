import { describe, expect, it } from "bun:test";

import { resolveTransport } from "./sender";

describe("resolveTransport", () => {
  it("respeita EMAIL_TRANSPORT válido", () => {
    expect(resolveTransport({ EMAIL_TRANSPORT: "smtp" })).toBe("smtp");
    expect(resolveTransport({ EMAIL_TRANSPORT: "console" })).toBe("console");
  });

  it("usa console fora de produção quando não definido", () => {
    expect(resolveTransport({ NODE_ENV: "development" })).toBe("console");
  });

  it("em produção sem definição, ou com valor desconhecido, não envia", () => {
    expect(resolveTransport({ NODE_ENV: "production" })).toBeNull();
    expect(resolveTransport({ EMAIL_TRANSPORT: "carrier-pigeon" })).toBeNull();
  });
});
