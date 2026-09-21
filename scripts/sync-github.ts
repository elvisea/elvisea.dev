/**
 * Atualiza o snapshot de repositórios públicos do GitHub.
 *
 *   bun run sync:github            # sem token (60 req/h, suficiente)
 *   GITHUB_TOKEN=... bun run sync:github
 *
 * Usa `GET /users/{user}/repos?type=owner`, que só devolve repositórios
 * públicos independentemente do token. Pagina pelo header `Link`, valida com
 * zod e grava JSON ordenado por nome para o diff do PR ficar legível.
 *
 * O site nunca chama a API em runtime: o snapshot é versionado e revisado.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  GithubRepoSchema,
  GithubSnapshotSchema,
  type GithubRepo,
} from "../features/projects/repository/schema";

const USER = "elvisea";
const OUTPUT = path.join(
  import.meta.dir,
  "..",
  "content",
  "pt-BR",
  "projetos",
  "github-snapshot.json",
);

/** Extrai a URL `rel="next"` do header `Link` da API do GitHub. */
export function nextPageUrl(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(",")) {
    const match = /<([^>]+)>;\s*rel="next"/.exec(part.trim());
    if (match) return match[1];
  }
  return null;
}

/** Só o que o script usa do `fetch`, para os testes passarem respostas falsas. */
export type FetchPage = (
  url: string,
  init: { headers: Record<string, string> },
) => Promise<Response>;

/**
 * Busca todas as páginas de repositórios públicos, validando cada um.
 * `fetchPage` e `token` são injetáveis (padrão: `fetch` e `GITHUB_TOKEN`).
 */
export async function fetchAllRepos(
  fetchPage: FetchPage = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "elvisea.dev-sync",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const repos: GithubRepo[] = [];
  let url: string | null =
    `https://api.github.com/users/${USER}/repos?type=owner&per_page=100`;

  while (url) {
    const response: Response = await fetchPage(url, { headers });
    if (!response.ok) {
      throw new Error(
        `GitHub respondeu ${response.status} em ${url}: ${await response.text()}`,
      );
    }
    const page = (await response.json()) as unknown[];
    for (const raw of page) {
      const parsed = GithubRepoSchema.safeParse(raw);
      if (!parsed.success) {
        const name = (raw as { name?: string }).name ?? "?";
        throw new Error(
          `Repositório "${name}" inválido: ${parsed.error.message}`,
        );
      }
      repos.push(parsed.data);
    }
    url = nextPageUrl(response.headers.get("link"));
  }

  return repos;
}

async function main() {
  const repos = await fetchAllRepos();
  const snapshot = GithubSnapshotSchema.parse({
    user: USER,
    repos: repos
      .map((repo) => GithubRepoSchema.parse(repo))
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
  await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(
    `${snapshot.repos.length} repositórios públicos gravados em ${OUTPUT}`,
  );
}

if (import.meta.main) {
  await main();
}
