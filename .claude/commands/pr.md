---
description: Revisa, valida e abre o pull request para a develop com resumo, verificação e Closes #N; depois acompanha os checks.
argument-hint: "[base, padrão develop]"
---

# Pull request

## Pré-requisitos

1. Branch `tipo/<número>` com commits em Conventional Commits
   ([`commit.md`](./commit.md)).
2. **Review** sem críticos em aberto: [`review.md`](./review.md) ou o agente
   [`code-reviewer`](../agents/code-reviewer.md).
3. **Validação local** completa:

   ```bash
   bun run format:check && bun run lint && bun run typecheck && bun test && bun --bun run build
   ```

4. **Verificação no navegador** quando houver mudança visual ou de rota: skills
   `smoke-test` e `seo-audit` (acessibilidade e SEO).
5. Branch atualizada com a base (`git fetch origin && git merge origin/develop`),
   com a validação refeita se entrou algo novo.

## Base

| PR                        | Base                          |
| ------------------------- | ----------------------------- |
| Trabalho normal           | `develop`                     |
| Release (v1.0.0, v1.1.0…) | `main`, a partir de `develop` |
| Correção urgente          | `main`                        |

## Descrição

Título igual a um Conventional Commit: `tipo(escopo): descrição`.

```markdown
## Resumo

O que muda e por quê, em 2–4 linhas.

## Para revisar

Texto público novo, decisão que o dono precisa confirmar, risco conhecido.
(Omitir se não houver.)

## O que muda

- Bullets por área, com os arquivos principais.

## Verificação

- Comandos rodados e resultado (testes, build).
- O que foi conferido no navegador ou no build de produção.

Closes #N

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- Fatos da verificação só se foram realmente executados.
- A assinatura final entra quando o PR vem de um agente.

## Comandos

```bash
git push -u origin "$(git branch --show-current)"

gh pr create --base develop --assignee @me \
  --title "feat(escopo): descrição" \
  --body "$(cat <<'EOF'
…
EOF
)"
```

Para editar a descrição depois, use a API (o `gh pr edit` falha neste
repositório por causa do Projects clássico):

```bash
gh api -X PATCH repos/elvisea/elvisea.dev/pulls/<N> -F body=@corpo.md
```

## Depois de abrir

- **Acompanhar os checks** com a skill [`pr-checks`](../skills/pr-checks/SKILL.md)
  até ficarem verdes ou até haver bloqueio que exija decisão humana.
- Mudanças só em `.claude/**`, `.cursor/**`, `AGENTS.md` ou `CLAUDE.md` não
  disparam a CI (`paths-ignore`).
- **Issues:** a branch padrão do repositório é `main`, então o `Closes #N` de um
  PR para `develop` não fecha a issue no merge. Ela fecha quando o PR de release
  chega na `main`; por isso o PR de release acumula os `Closes` do ciclo.

## Regras

- Nunca incluir `.env`, segredo ou dado pessoal na descrição.
- Descrição curta: o que, por quê e como foi verificado.
