import { describe, expect, it, mock } from "bun:test";

import { type FetchPage, fetchAllRepos, nextPageUrl } from "./sync-github";

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

function repo(name: string, extra: Record<string, unknown> = {}) {
  return {
    name,
    description: null,
    html_url: `https://github.com/elvisea/${name}`,
    homepage: null,
    language: "TypeScript",
    topics: [],
    stargazers_count: 0,
    fork: false,
    archived: false,
    private: false,
    created_at: "2024-01-01T00:00:00Z",
    pushed_at: "2025-01-01T00:00:00Z",
    ...extra,
  };
}

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), init);
}

describe("fetchAllRepos", () => {
  it("segue o header Link até a última página e junta os repositórios", async () => {
    const pages: Record<string, Response> = {
      first: json([repo("a")], {
        headers: { link: '<https://api.github.com/page2>; rel="next"' },
      }),
      "https://api.github.com/page2": json([repo("b")]),
    };
    const fetchPage = mock<FetchPage>(async (url) =>
      url.startsWith("https://api.github.com/users/")
        ? pages.first!
        : pages[url]!,
    );
    const repos = await fetchAllRepos(fetchPage, undefined);
    expect(repos.map((r) => r.name)).toEqual(["a", "b"]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage.mock.calls[0]?.[1].headers).not.toHaveProperty(
      "Authorization",
    );
  });

  it("com token, envia o Authorization", async () => {
    const fetchPage = mock<FetchPage>(async () => json([]));
    await fetchAllRepos(fetchPage, "segredo");
    expect(fetchPage.mock.calls[0]?.[1].headers.Authorization).toBe(
      "Bearer segredo",
    );
  });

  it("resposta de erro interrompe com status e URL", async () => {
    const fetchPage: FetchPage = async () =>
      new Response("rate limit", { status: 403 });
    await expect(fetchAllRepos(fetchPage, undefined)).rejects.toThrow(
      /GitHub respondeu 403 em https:\/\/api\.github\.com\/users\/elvisea\/repos/,
    );
  });

  it("repositório privado ou inválido interrompe com o nome", async () => {
    const fetchPage: FetchPage = async () =>
      json([repo("vazou", { private: true })]);
    await expect(fetchAllRepos(fetchPage, undefined)).rejects.toThrow(
      'Repositório "vazou" inválido',
    );
  });
});
