/**
 * Curadoria dos projetos exibidos em `/projetos` e na home.
 *
 * Hoje: todos os repositórios públicos do snapshot, menos `exclude`. Para
 * mudar a estratégia depois, basta editar este arquivo:
 * - `mode: "curated"` + `include` para listar só os escolhidos;
 * - `hideForks` / `hideWithoutDescription` para filtros gerais;
 * - `featured` para fixar os destaques da home;
 * - `overrides` para título, resumo e tags próprios (repos sem descrição);
 * - `manual` para estudos de caso de projetos privados (sem link de código).
 *
 * O snapshot vem de `bun run sync:github`. Nomes aqui precisam existir nele
 * (o teste confere).
 */
import type { ProjectsConfig } from "@/features/projects/repository/types";

export const projectsConfig = {
  mode: "all",
  include: [],
  exclude: [
    // Dados pessoais (backup do LinkedIn).
    "info_linkedin",
    // Código ligado a empregadores (Trio e ATZ AERO).
    "umbrella-trio-lottopar",
    "aerobi-poc",
    // Produtos próprios que não devem ser associados ao site (nicho do produto)
    // ou cujo nome, sem README, passa a ideia errada (disparo em massa).
    "viki_assistant_minio",
    "envio-de-mensagens-em-massa",
    // Detalhes de infraestrutura própria.
    "local-infra",
    "openvpn",
    // Repositórios de teste.
    "app_teste",
    "my-bun-app-test",
    "repo-teste",
    "expo-stripe-teste",
    "expo-freela-jobs-partner-teste",
  ],
  hideForks: false,
  hideWithoutDescription: false,
  featured: [],
  overrides: {},
  manual: [],
} as const satisfies ProjectsConfig;
