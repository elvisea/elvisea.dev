import { describe, expect, it } from "bun:test";

import { escapeXml, rfc822 } from "./rss";

describe("rss", () => {
  it("escapa caracteres especiais de XML", () => {
    expect(escapeXml(`A & B <c> "d" 'e'`)).toBe(
      "A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;",
    );
  });

  it("formata a data em RFC 822 sem trocar o dia", () => {
    expect(rfc822("2026-09-16")).toBe("Wed, 16 Sep 2026 12:00:00 GMT");
  });
});
