import { describe, expect, it } from "bun:test";

import { buildSitemapEntries } from "./sitemap";

describe("buildSitemapEntries", () => {
  it("monta a URL absoluta a partir do caminho", () => {
    expect(
      buildSitemapEntries("https://elvisea.dev", [
        { path: "/", changeFrequency: "monthly", priority: 1 },
      ]),
    ).toEqual([
      {
        url: "https://elvisea.dev/",
        changeFrequency: "monthly",
        priority: 1,
      },
    ]);
  });

  it("converte a data para meia-noite UTC só quando existe", () => {
    const [comData, semData] = buildSitemapEntries("https://elvisea.dev", [
      {
        path: "/blog/post",
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: "2026-03-10",
      },
      { path: "/sobre", changeFrequency: "monthly", priority: 0.8 },
    ]);
    expect(comData?.lastModified).toEqual(new Date("2026-03-10T00:00:00Z"));
    expect(semData).not.toHaveProperty("lastModified");
  });
});
