# Abrir Pull Request (GitHub)

Fluxo habitual: **`develop`** integra trabalho cotidiano; **`main`** representa linha que dispara CI de release (**semantic-release**).

## Repo

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
```

## Pré-checks

1. Rode o fluxo equivalente ao `/review` (comando ou agent `code-reviewer`) para
   checagens rápidas.
2. Confirmar **`bun test`**, `bun run lint`, `bun run format:check` e **`bun --bun run build`** onde fizer parte do escopo da mudança.
3. Commits nos padrões `conventionalcommits` onde o projeto adota release automático na `main`.
4. Branch atualizada com a base (**rebase ou merge conforme política da equipe**).

## Direção típica do PR

| Origem                          | Base do PR usual                                                         |
| ------------------------------- | ------------------------------------------------------------------------ |
| trabalho cotidiano (feat/fix/…) | `develop`                                                                |
| hotfix urgente (`hotfix/*`)     | `main` primeiro; segundo PR/sync para `develop` depois conforme playbook |
| release preparado (`release/*`) | `main` primeiro; sincronização com `develop` depois conforme playbook    |

(Ajustar se sua equipe inverter qualquer parte desse modelo.)

## Workflow

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"

git push -u origin "$(git branch --show-current)"

gh pr create --repo "$REPO" \
  --title "feat(ui): timeline de experiências" \
  --base develop \
  --body "$(cat <<'EOF'
## Contexto

- …

## Tipo de mudança

- [ ] Nova funcionalidade
- [ ] Correção
- [ ] Chore / CI / docs

## Checklist

- [ ] Review rápido (checklist comando review)
- [ ] Sem `.env`/segredos
- [ ] `bun test` / lint / format / build onde aplicável

Closes #N
EOF
)"
```

Adaptar `--assignee` e labels conforme o time.

## Regras

- Incluir `Closes #N` quando a issue deva ser fechada pelo merge (GitHub).
- Nunca subir dados sensíveis ou credenciais.
- Preferir uma descrição curta focada em “o que” e “por quê técnico”.
