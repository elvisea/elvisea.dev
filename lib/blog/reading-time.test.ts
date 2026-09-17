import { describe, expect, it } from "bun:test";

import { readingMinutes } from "./reading-time";

describe("readingMinutes", () => {
  it("tem mínimo de 1 minuto", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("poucas palavras aqui")).toBe(1);
  });

  it("arredonda para cima a 200 palavras por minuto", () => {
    expect(readingMinutes(Array(201).fill("palavra").join(" "))).toBe(2);
    expect(readingMinutes(Array(400).fill("palavra").join(" "))).toBe(2);
  });

  it("ignora blocos de código", () => {
    const code = "```ts\n" + Array(1000).fill("x").join(" ") + "\n```";
    expect(readingMinutes(code)).toBe(1);
  });
});
