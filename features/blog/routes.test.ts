import { describe, expect, it } from "bun:test";

import { linkedInShareUrl, postPath } from "./routes";

describe("rotas do blog", () => {
  it("caminho do post", () => {
    expect(postPath("meu-post")).toBe("/blog/meu-post");
  });

  it("compartilhamento no LinkedIn com a URL escapada", () => {
    expect(linkedInShareUrl("https://elvisea.dev/blog/meu-post")).toBe(
      "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Felvisea.dev%2Fblog%2Fmeu-post",
    );
  });
});
