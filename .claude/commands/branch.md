# Criar branch (Gitflow enxuto)

Cria ramo a partir de **`develop`** ou **`main`** conforme tipo, sempre
**associado ao número da issue no GitHub** (rastreio + PR).

## Repo e variáveis

Sempre usar o GitHub remoto atual. Antes dos exemplos:

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo "$REPO"
```

Opcionalmente defina um assignee padrão (`ASSIGNEE`) quando o projeto tiver política definida.

## Convenção de nome da branch

**Forma principal (preferida neste projeto):** só tipo + número da issue GitHub —
**sem obrigatoriedade de slug.**

```
<tipo>/<número>
```

Ex.: `feat/12`, `chore/87`, `fix/3`.

`número` é **somente os dígitos** retornados ao criar ou listar issues (ex.: issue `#87` → `87`).

**Forma opcional** (discrimina trabalhos paralelos na mesma issue ou legibilidade no remoto):

```
<tipo>/<número>-<slug-kebab-case>
```

Ex.: `chore/87-dev-tooling-docker`.

Tipos típicos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`,
`hotfix`, `release`.

## Issue antes da branch — obrigatório sem issue

Quando **não** existir issue para o trabalho:

1. Criar a issue primeiro (capturar o **número** retornado pelo GitHub).
2. Só depois criar a branch **`tipo/<número>`** (mais slug opcional, se quiser).

Exemplo criar issue:

```bash
gh issue create --repo "$REPO" \
  --title "chore(config): toolchain, CI e Docker baseline" \
  --body "Contexto objetivo para o trabalho atual."
```

Markdown com várias linhas: use **`--body "$(cat <<'EOF' … EOF)"`** ou **`--body-file ficheiro.md`**. Evite o literal `\n` dentro de `"…"` — o GitHub mostra-o como texto, não como quebra.

Registrar o **`#N`** exibido no output ou com `gh issue view <url> --json number -q .number`.

## Branch de origem

| Prefixo típico            | Checkout a partir de | Merge alvo habitual                   |
| ------------------------- | -------------------- | ------------------------------------- |
| feat, fix, chore, docs, … | `develop`            | `develop`                             |
| hotfix/\*                 | `main`               | `main` + sincroniza `develop` depois  |
| release/vX.Y.Z            | `develop`            | `main` (+ tag) + sincroniza `develop` |

## Workflow

1. **Issue garantida:** se não houver número, usar seção anterior e criar issue.
2. Escolher `tipo`, confirmar **`número`**; slug opcional; apresentar o nome ao usuário.

3. Atualizar a base antes de criar branch:

```bash
git checkout develop && git pull origin develop
# ou para hotfix: git checkout main && git pull origin main
```

4. Criar: `git checkout -b tipo/numero` (ou `tipo/numero-descricao-kebab` se optar pelo sufixo).

5. (Opcional) `gh issue develop <numero> --repo "$REPO" -n tipo/numero …`
   se o fluxo da equipe usar desenvolvimento vinculado no GitHub.

6. Push quando houver trabalho inicial: `git push -u origin <branch>`.

## Regras

- Preferir sempre **nome curto**, sem acentos, só `[a-z0-9/-]`.
- **Não inventar número** — sempre o da issue criada/consultada.
- Hotfix sempre de `main` atualizado — não partir de `develop` defasada.
- Não trabalhar commits diretos em `main`/`develop` quando o fluxo usar PRs.
