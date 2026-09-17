import { describe, expect, it } from "bun:test";

import { teaserUrl } from "./teaser";

describe("teaserUrl", () => {
  it("monta a URL canônica com UTM do LinkedIn", () => {
    expect(teaserUrl("meu-post")).toBe(
      "https://elvisea.dev/blog/meu-post?utm_source=linkedin&utm_medium=social&utm_campaign=meu-post",
    );
  });
});
