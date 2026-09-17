import { describe, expect, it } from "bun:test";

import { createLogger, formatEvent, resolveLogFormat } from "./logger";

const fixed = new Date("2026-09-17T12:00:00.000Z");

describe("resolveLogFormat", () => {
  it("respeita LOG_FORMAT válido", () => {
    expect(resolveLogFormat({ LOG_FORMAT: "json" })).toBe("json");
    expect(
      resolveLogFormat({ LOG_FORMAT: "pretty", NODE_ENV: "production" }),
    ).toBe("pretty");
  });

  it("usa json em produção e pretty no resto", () => {
    expect(resolveLogFormat({ NODE_ENV: "production" })).toBe("json");
    expect(resolveLogFormat({ NODE_ENV: "development" })).toBe("pretty");
    expect(resolveLogFormat({ LOG_FORMAT: "xml" })).toBe("pretty");
  });
});

describe("formatEvent", () => {
  it("json: uma linha com ts, level, event e campos", () => {
    const line = formatEvent(
      "json",
      "info",
      "contact.sent",
      { durationMs: 3 },
      fixed,
    );
    expect(line).not.toContain("\n");
    expect(JSON.parse(line)).toEqual({
      ts: "2026-09-17T12:00:00.000Z",
      level: "info",
      event: "contact.sent",
      durationMs: 3,
    });
  });

  it("pretty: JSON indentado", () => {
    const line = formatEvent("pretty", "info", "x", {}, fixed);
    expect(line).toContain('\n  "event": "x"');
  });

  it("serializa Error com código; stack só no pretty", () => {
    const err = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
    const json = JSON.parse(
      formatEvent("json", "error", "e", { error: err }, fixed),
    );
    expect(json.error).toEqual({
      name: "Error",
      message: "timeout",
      code: "ETIMEDOUT",
    });
    const pretty = JSON.parse(
      formatEvent("pretty", "error", "e", { error: err }, fixed),
    );
    expect(pretty.error.stack).toBeString();
  });

  it("omite campos undefined", () => {
    const json = JSON.parse(
      formatEvent("json", "info", "e", { a: undefined, b: 1 }, fixed),
    );
    expect(json).not.toHaveProperty("a");
    expect(json.b).toBe(1);
  });
});

describe("createLogger", () => {
  it("escreve no destino com o nível certo", () => {
    const lines: [string, string][] = [];
    const log = createLogger({
      format: "json",
      write: (level, line) => lines.push([level, line]),
      now: () => fixed,
    });
    log.warn("contact.rate_limited", { ipPrefix: "203.0.113.0/24" });
    log.error("contact.send_failed");
    expect(lines.map(([level]) => level)).toEqual(["warn", "error"]);
    expect(JSON.parse(lines[0][1]).ipPrefix).toBe("203.0.113.0/24");
  });
});
