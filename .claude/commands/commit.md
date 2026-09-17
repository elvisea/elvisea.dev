# Commit inteligente (Conventional Commits)

Commits agrupados por contexto funcional e alinhados a **Semantic Release**
(preset `conventionalcommits` em `main`).

## Contexto do projeto

- Fluxo habitual: trabalho integra em **`develop`**; **`main`** recebe merges
  que acionam release e versão (`semantic-release`).
- Preferir commits que **fecha um incremento revisável**: um grupo lógico de
  arquivos por commit.
- Convenção da branch segue **`tipo/<número>`** (com slug opcional; ver comando
  `branch`). **O tipo do commit** deve ser coerente com o prefixo da branch
  (`feat/12` → commits `feat`).

## Convenção (Conventional Commits)

Formato: `tipo(escopo opcional): descrição`

| Tipo       | Uso                                     |
| ---------- | --------------------------------------- |
| `feat`     | Nova funcionalidade                     |
| `fix`      | Correção de bug                         |
| `chore`    | Manutenção, dependências, configuração  |
| `docs`     | Documentação                            |
| `style`    | Formatação sem mudança de lógica        |
| `refactor` | Refatoração sem nova feature ou bug fix |
| `test`     | Adição ou correção de testes            |
| `perf`     | Melhorias de performance                |

**Escopo** é opcional. Exemplo: `feat(ui): timeline de experiências`.

**Corpo** — quando o título não basta:

```
fix(ci): corrige ordenação das etapas no workflow

Evita corrida entre jobs que compartilham cache.
```

## Escopos comuns neste projeto

- `content` — textos e dados em `content/pt-BR/` (seguir as regras de conteúdo do `AGENTS.md`).
- `blog` — posts e sistema de blog (`lib/blog`, `app/blog`).
- `ui` — componentes fora da camada shadcn pura (`components/*`).
- `actions` — Server Actions e boundaries de entrada.
- `route` — Route Handlers (`app/api/**/route.ts`).
- `claude` — `AGENTS.md`, `CLAUDE.md`, `.claude/*` compartilhado.
- `config` — shadcn, Tailwind, Bun, ESLint, Prettier, TypeScript.
- `ci` — GitHub Actions, Trivy, gates de segurança.
- `deploy` — Docker, compose, `.dockerignore`.

## Workflow

1. `git status` e `git diff` / `git diff --cached` para entender o escopo.
2. Agrupar arquivos por feature/módulo.
3. Sugerir **um conjunto de commits** (mensagens Conventional) antes de gravar.
4. Só gravar após **confirmação explícita** do usuário.
5. `git add …` + `git commit -m "…"` (ou commit com corpo quando necessário).

## Regras de agrupamento

- Mesmo módulo/feature → mesmo commit quando fizer sentido.
- Testes `*.test.ts` do mesmo módulo → junto ao código quando pequenos.
- Só mudanças de dependência ou lock (`package.json`, `bun.lock`) → `chore(deps)`
  ou `chore` dedicado.
- Alterações apenas em tooling local (`.claude/`, comandos docs) → `docs(claude)`
  ou `chore(claude)`.

## Checklist antes de commitar

- [ ] Título dentro do limite prático (~72 caracteres).
- [ ] Mensagem compatível com o que será versionado na `main` (Breaking changes
      documentados quando aplicável — `feat!:` ou BREAKING CHANGE no footer).
- [ ] Nada de `.env*`, secrets ou dados sensíveis no stage.
