/**
 * Curadoria dos projetos exibidos em `/projetos` e na home.
 *
 * Hoje: todos os repositórios públicos do snapshot (os marcados com o tópico
 * `no-portfolio` no GitHub nem chegam a ele), menos `exclude`. Para
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
  // Para esconder um repositório, marque-o no GitHub com o tópico
  // `no-portfolio` (HIDE_TOPIC) e rode `bun run sync:github`: ele sai do
  // snapshot e o nome não precisa aparecer aqui. Isso vale para código de
  // empregador ou cliente, produtos de nicho, infraestrutura própria e testes.
  // `exclude` fica para casos sem esse problema.
  exclude: [
    // README do perfil do GitHub, sem código.
    "elvisea",
  ],
  hideForks: false,
  hideWithoutDescription: false,
  featured: [],
  overrides: {
    // O homepage no GitHub aponta para um subdomínio da Byteful Code, fora do ar.
    frontend_lawyers_and_clients: { liveUrl: null },
  },
  manual: [],
} as const satisfies ProjectsConfig;
