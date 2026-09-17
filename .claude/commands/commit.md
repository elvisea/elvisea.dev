---
description: Agrupa as mudanças por contexto, valida localmente e propõe commits em Conventional Commits antes de gravar.
---

# Commit

Commits agrupados por incremento revisável, em **Conventional Commits**. A
`main` usa semantic-release (preset `conventionalcommits`): as mensagens viram
versão e changelog.

## Convenção

Formato: `tipo(escopo): descrição` (até ~72 caracteres, em português, sem ponto
final).

| Tipo       | Uso                                    |
| ---------- | -------------------------------------- |
| `feat`     | funcionalidade nova (versão minor)     |
| `fix`      | correção de bug (versão patch)         |
| `refactor` | reorganização sem mudar comportamento  |
| `perf`     | desempenho                             |
| `test`     | testes                                 |
| `docs`     | documentação                           |
| `style`    | formatação sem mudança de lógica       |
| `chore`    | manutenção, dependências, configuração |

Quebra de compatibilidade: `feat!:` ou rodapé `BREAKING CHANGE:` (versão major).

**Corpo** quando o título não basta: o porquê, o que muda para quem usa, a
decisão tomada. Termina com a linha de coautoria quando o commit vem de um
agente.

### Escopos do projeto

| Escopo     | Área                                                      |
| ---------- | --------------------------------------------------------- |
| `content`  | textos e dados em `content/pt-BR/` (regras de conteúdo)   |
| `home`     | página inicial                                            |
| `services` | `features/services`, `/servicos`                          |
| `projects` | `/projetos`, snapshot do GitHub, curadoria                |
| `blog`     | posts, `lib/blog`, `app/blog`, RSS                        |
| `contact`  | formulário, Server Action, e-mail                         |
| `seo`      | metadata, JSON-LD, sitemap, robots, redirects             |
| `logs`     | `lib/log`                                                 |
| `ui`       | componentes e estilos                                     |
| `a11y`     | acessibilidade                                            |
| `claude`   | `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.cursor/`          |
| `config`   | Next, Tailwind, shadcn, ESLint, Prettier, TypeScript, Bun |
| `deps`     | dependências e `bun.lock`                                 |
| `ci`       | GitHub Actions                                            |
| `docker`   | `Dockerfile`, compose                                     |
| `release`  | semantic-release                                          |

## Workflow

1. **Entender o escopo:** `git status`, `git diff`, `git diff --cached`.
2. **Validar** (o mesmo que a CI roda):

   ```bash
   bun run format:check && bun run lint && bun run typecheck && bun test
   ```

   Mudança que afeta rotas, build ou dependências: `bun --bun run build` também.
   Falhou: corrigir antes de commitar.

3. **Agrupar** por contexto e **propor** os commits (arquivos + mensagem).
4. **Confirmação:** gravar só depois do OK explícito do usuário, a menos que ele
   já tenha autorizado o fluxo completo nesta tarefa.
5. **Gravar:** `git add <arquivos>` + `git commit`. Nunca `git add -A` sem
   conferir o que entra.

## Agrupamento

- Código e o teste dele → mesmo commit.
- Conteúdo público (`content/pt-BR/`) → commit próprio, para revisão do texto.
- Dependências e lockfile → `chore(deps)` separado.
- `.claude/`, `.cursor/`, `AGENTS.md` → `chore(claude)` ou `docs(claude)`
  separado.
- Cada commit deve compilar e passar nos testes sozinho quando possível.

## Checklist

- [ ] Tipo coerente com a branch e com o efeito na versão.
- [ ] Nenhum `.env*`, segredo, dado pessoal ou detalhe interno de empregador no
      stage ou na mensagem (o histórico é público).
- [ ] Nenhuma mudança sem relação com o commit.
