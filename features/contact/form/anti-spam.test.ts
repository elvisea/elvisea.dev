import { describe, expect, it } from "bun:test";

import { detectBot, MIN_FILL_MS } from "./anti-spam";

const now = 1_700_000_000_000;

describe("detectBot", () => {
  it("isca preenchida é robô", () => {
    expect(
      detectBot({ honeypot: "http://x", startedAt: null }, now).honeypot,
    ).toBe(true);
    expect(detectBot({ honeypot: "", startedAt: null }, now).honeypot).toBe(
      false,
    );
  });

  it("envio antes do tempo mínimo é rápido demais", () => {
    const signals = detectBot(
      { honeypot: "", startedAt: now - MIN_FILL_MS + 1 },
      now,
    );
    expect(signals).toEqual({
      honeypot: false,
      elapsedMs: MIN_FILL_MS - 1,
      tooFast: true,
    });
  });

  it("no tempo mínimo ou depois, passa", () => {
    expect(
      detectBot({ honeypot: "", startedAt: now - MIN_FILL_MS }, now).tooFast,
    ).toBe(false);
  });

  it("sem startedAt (sem JavaScript) não bloqueia", () => {
    expect(detectBot({ honeypot: "", startedAt: null }, now)).toEqual({
      honeypot: false,
      elapsedMs: null,
      tooFast: false,
    });
  });
});
