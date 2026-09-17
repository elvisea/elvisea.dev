---
description: Garante a issue no GitHub e cria a branch tipo/<número> a partir da develop (na pasta atual ou numa worktree).
argument-hint: "[número da issue ou resumo do trabalho]"
---

# Branch

Toda mudança começa por uma **issue**; a branch leva o número dela. Não há PR
sem issue.

## Convenção

Formato: **`tipo/<número-da-issue>`**, sem slug.

| Tipo       | Uso                                    |
| ---------- | -------------------------------------- |
| `feat`     | funcionalidade nova                    |
| `fix`      | correção de bug                        |
| `refactor` | reorganização sem mudar comportamento  |
| `docs`     | documentação                           |
| `test`     | testes                                 |
| `perf`     | desempenho                             |
| `chore`    | manutenção, dependências, configuração |

- ✅ `feat/33`, `chore/35`
- ❌ `feature/pagina-servicos`, `feat/33-servicos`

O tipo da branch define o tipo dos commits (`feat/33` → `feat(...)`).

## Base

| Situação                     | Parte de  | PR para                             |
| ---------------------------- | --------- | ----------------------------------- |
| Trabalho normal              | `develop` | `develop`                           |
| Correção urgente em produção | `main`    | `main`, depois sincroniza `develop` |

Release não usa branch própria: é um PR de `develop` para `main`.

## Workflow

1. **Issue.** Se não existir, criar com contexto, escopo e critério de aceite.
   Registrar o número devolvido; **nunca inventar número**.

   ```bash
   gh issue create --assignee @me \
     --title "feat(escopo): descrição curta" \
     --body "$(cat <<'EOF'
   ## Contexto
   …
   ## Escopo
   …
   ## Aceite
   …
   EOF
   )"
   ```

   Corpo com várias linhas sempre por heredoc ou `--body-file`; `\n` dentro de
   aspas aparece literal no GitHub.

2. **Confirmar** o nome `tipo/<número>` com o usuário quando o tipo não for
   óbvio pela issue.

3. **Onde trabalhar:**
   - Na pasta atual (uma tarefa por vez):

     ```bash
     git checkout develop && git pull origin develop
     git checkout -b feat/<número>
     ```

   - Em paralelo a outro trabalho ou a outro agente: numa worktree
     (ver [`worktree.md`](./worktree.md)).

4. **Publicar** quando houver o primeiro commit:
   `git push -u origin feat/<número>`.

## Regras

- Nome só com `[a-z0-9/]`.
- Nada de commit direto em `develop` ou `main`.
- Hotfix parte de `main` atualizada, nunca de `develop`.
