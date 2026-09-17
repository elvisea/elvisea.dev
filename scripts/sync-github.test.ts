import { describe, expect, it } from "bun:test";

import { nextPageUrl } from "./sync-github";

describe("nextPageUrl", () => {
  it("extrai a próxima página do header Link", () => {
    const header =
      '<https://api.github.com/user/1/repos?page=2>; rel="next", <https://api.github.com/user/1/repos?page=3>; rel="last"';
    expect(nextPageUrl(header)).toBe(
      "https://api.github.com/user/1/repos?page=2",
    );
  });

  it("devolve null na última página ou sem header", () => {
    expect(nextPageUrl('<https://x/?page=1>; rel="prev"')).toBeNull();
    expect(nextPageUrl(null)).toBeNull();
  });
});
