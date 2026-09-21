/**
 * Contrato do snapshot de repositórios do GitHub
 * (`content/pt-BR/projetos/github-snapshot.json`).
 *
 * É dado externo, então é validado com zod no script de sync e de novo ao
 * carregar em build. `private: false` é literal: um repositório privado no
 * snapshot quebra o build em vez de ir ao ar.
 */
import { z } from "zod";

export const GithubRepoSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  html_url: z.url(),
  homepage: z.string().nullable(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  stargazers_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
  private: z.literal(false),
  created_at: z.iso.datetime(),
  pushed_at: z.iso.datetime(),
});

export type GithubRepo = z.infer<typeof GithubRepoSchema>;

export const GithubSnapshotSchema = z.object({
  user: z.string().min(1),
  repos: z.array(GithubRepoSchema),
});

export type GithubSnapshot = z.infer<typeof GithubSnapshotSchema>;
