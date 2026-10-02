# Escopos de commit — elvisea.dev

Conventional Commits em português: `tipo(escopo): descrição`, com até ~72
caracteres e sem ponto final. O tipo do commit casa com o tipo da branch
(`feat/33` → `feat(...)`). Corpo quando o título não basta: o porquê, o que
muda para quem usa, a decisão tomada.

## Versões (semantic-release na `main`, preset `conventionalcommits`)

| Tipo                                               | Gera release?               |
| -------------------------------------------------- | --------------------------- |
| `feat`                                             | minor                       |
| `fix`, `perf`                                      | patch                       |
| `feat!:` ou rodapé `BREAKING CHANGE:`              | major (só para quebra real) |
| `refactor`, `test`, `docs`, `style`, `chore`, `ci` | não                         |

O `.releaserc.json` usa as regras padrão do `@semantic-release/commit-analyzer`.

## O que cada merge dispara

| Merge                            | Dispara                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch de trabalho → `develop`   | CI na `develop`. Nada de release nem deploy.                                                                                                                                                                                                                                                                                                                                          |
| Release `develop` → `main`       | workflow Release: semantic-release (tag, `CHANGELOG.md`, release no GitHub, commit `chore(release): <versão> [skip ci]` na `main`) e, só quando sai versão, imagem Docker no GHCR (`<versão>` e `latest`). Sem `feat`/`fix`/`perf`/quebra no ciclo, não sai versão nem imagem. **Sem deploy automático:** o deploy é trocar a tag da imagem na stack do homelab (README § Onde roda). |
| Sincronização `main` → `develop` | nada (o topo tem `[skip ci]`; a validação desse PR é local).                                                                                                                                                                                                                                                                                                                          |

Todo merge pede OK explícito do dono no chat (`merge.approval: "all"`).

## Escopos

| Escopo     | Área                                                          |
| ---------- | ------------------------------------------------------------- |
| `content`  | textos e dados em `content/pt-BR/` (regras de conteúdo)       |
| `home`     | página inicial                                                |
| `services` | `features/services`, `/servicos`                              |
| `projects` | `/projetos`, snapshot do GitHub, curadoria                    |
| `blog`     | posts, `features/blog`, `app/blog`, RSS                       |
| `contact`  | formulário, Server Action, e-mail                             |
| `seo`      | metadata, JSON-LD, sitemap, robots, redirects                 |
| `logs`     | `lib/log`                                                     |
| `ui`       | componentes e estilos                                         |
| `a11y`     | acessibilidade                                                |
| `agents`   | `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.cursor/`, `.harness/` |
| `config`   | Next, Tailwind, shadcn, ESLint, Prettier, TypeScript, Bun     |
| `deps`     | dependências e `bun.lock`                                     |
| `ci`       | GitHub Actions                                                |
| `docker`   | `Dockerfile`, compose                                         |
| `release`  | semantic-release                                              |

Até a v1.5.0 o escopo dos arquivos de agente era `claude`; desde a adoção do
agent-harness é `agents`.

## Agrupamento

- Código e o teste dele → mesmo commit.
- Conteúdo público (`content/pt-BR/`) → commit próprio, para revisão do texto.
- Dependências e lockfile → `chore(deps)` separado.
- `.claude/`, `.cursor/`, `.harness/`, `AGENTS.md` → `chore(agents)` ou
  `docs(agents)` separado.
- Cada commit deve compilar e passar nos testes sozinho quando possível.
- Nenhum `.env*`, segredo, dado pessoal ou detalhe interno de empregador no
  stage ou na mensagem: o histórico é público.
