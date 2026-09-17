import { describe, expect, it } from "bun:test";

import { blogIndexMetadata } from "./metadata";

describe("blogIndexMetadata", () => {
  it("não indexa a listagem enquanto não há posts", () => {
    expect(blogIndexMetadata(0).robots).toEqual({ index: false, follow: true });
  });

  it("volta a indexar com o primeiro post", () => {
    const meta = blogIndexMetadata(1);
    expect(meta.robots).toBeUndefined();
    expect(meta.alternates?.canonical).toBe("/blog");
  });
});
