# Merge de PR + pós-merge (GitHub)

Ajuda a fechar ciclo da PR já **aprovada e verde** (CI). Não faz merge sem
confirmação humana explícita.

## Repo

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
BRANCH="$(git branch --show-current)"
```

## Pré-condições

- Working tree limpo.
- PR aberta para a branch atual, `MERGEABLE`, checks OK.
- Estratégia de merge alinhada com o time (merge commit ou squash — só com
  confirmação explícita se for algo diferente do padrão).

## Fluxo principal

### 1) Localizar PR

```bash
gh pr list --repo "$REPO" --head "$BRANCH" \
  --json number,baseRefName,title,url,mergeable,state
```

### 2) Confirmar com o usuário

Mostrar número, título, base, URL antes de mesclar.

### 3) Mesclar (exemplo: merge commit + apagar ramo remoto)

```bash
gh pr merge <NUM> --repo "$REPO" --merge --delete-branch
```

Se for **release ou hotfix** em `main` com tagging manual, repetir apenas o que
política do time exige (alguns projetos deixam a tag para **semantic-release**).

### 4) Limpeza local

```bash
git checkout develop   # ou a base correta
git pull origin develop
git branch -d "$BRANCH"   # só se já estiver totalmente merged; investigar antes de -D
```

### Regras

- ❌ Sem merge se houver pendências não resolvidas ou sem OK explícito.
- ❌ Sem `push --force` em `main` / `develop`.
- ✅ Preferir `-d` (minúsculo) para apagar ramo local; investigar antes de `-D`.
