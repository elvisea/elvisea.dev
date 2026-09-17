---
description: Mescla o PR verde (merge commit), fecha a issue, limpa branch e worktree locais e mantém o PR de release em dia.
argument-hint: "[número do PR]"
disable-model-invocation: true
---

# Merge e pós-merge

## Quem autoriza

| PR                                              | Merge                                                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Branch de trabalho para `develop`               | autorizado pelo dono do repositório assim que a CI passa                                                          |
| Sincronização `main` → `develop` (após release) | autorizado com a validação local registrada no PR, porque o `[skip ci]` impede a CI (§ Merge de release, passo 4) |
| Release `develop` → `main`                      | **só com OK explícito** do dono (gera tag, release e imagem)                                                      |
| Correção urgente para `main`                    | só com OK explícito                                                                                               |

Sem CI verde (ou validação local, no caso da sincronização) ou com conflito,
não mesclar em nenhum caso.

## Workflow

1. **Localizar o PR** (número em `$ARGUMENTS` ou pela branch atual):

   ```bash
   gh pr list --head "$(git branch --show-current)" \
     --json number,baseRefName,title,url,mergeable,state
   gh pr checks <N>
   ```

   Abortar se não estiver `MERGEABLE` ou se algum check não passou.

2. **Confirmar** número, título, base e URL com o usuário quando a tabela acima
   exigir OK.

3. **Mesclar** com merge commit e apagar a branch remota:

   ```bash
   gh pr merge <N> --merge --delete-branch
   ```

   - `--squash`/`--rebase` só se o usuário pedir.
   - **Origem `develop` ou `main`** (release ou sincronização): **sem**
     `--delete-branch`. Seguir a seção [Merge de release](#merge-de-release-develop--main)
     em vez deste workflow.

4. **Limpeza local:**

   ```bash
   git checkout develop && git pull --ff-only origin develop
   git branch -d <branch>             # -d só apaga o que já foi mesclado
   git worktree remove ../elvisea.dev-<número>   # se o trabalho foi numa worktree
   git worktree prune
   ```

   `git branch -d` falhou com "not fully merged": investigar antes de pensar
   em `-D`.

5. **Fechar a issue.** A branch padrão do GitHub é `main`, então o `Closes #N`
   de um PR para `develop` não fecha a issue sozinho. Fechar aqui as issues do
   PR, e **só** elas:

   | Origem do número                                                       | Condição                                                                   | O que acontece                                 |
   | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- |
   | Branch (`fix/39` → #39)                                                | sufixo numérico                                                            | fecha automaticamente                          |
   | Linha própria `Closes #N` no corpo (ou `Fixes`/`Resolves` e variações) | fora de bloco de código; aceita marcador de lista (`- `) e pontuação final | só fecha **depois de confirmar** com o usuário |
   | Menção no meio de frase ou dentro de bloco de código                   | —                                                                          | não conta                                      |

   Só fecha **issue aberta**: issues e PRs compartilham a numeração, e `#12`
   pode ser um PR.

   ````bash
   N=<número do PR>
   BRANCH=$(gh pr view "$N" --json headRefName -q .headRefName)
   case "${BRANCH##*/}" in (''|*[!0-9]*) DA_BRANCH= ;; (*) DA_BRANCH="${BRANCH##*/}" ;; esac
   REFS=$(gh pr view "$N" --json body -q .body \
     | awk '/^[[:space:]]*```/ { codigo = !codigo; next } !codigo' \
     | grep -iE '^[[:space:]]*([-*][[:space:]]+)?(close[sd]?|fix(es|ed)?|resolve[sd]?)[[:space:]]+#[0-9]+[.,;]?[[:space:]]*$' \
     | grep -oE '[0-9]+')
   printf '%s\n' "$DA_BRANCH" "$REFS" | grep -E '^[0-9]+$' | sort -un | while read -r i; do
     read -r state kind <<< "$(gh api "repos/{owner}/{repo}/issues/$i" \
       --jq '.state + " " + (if .pull_request then "pr" else "issue" end)')"
     if [ "$kind" != issue ] || [ "$state" != open ]; then
       echo "#$i ignorada ($kind, $state)"
     elif [ "$i" = "$DA_BRANCH" ]; then
       gh issue close "$i" --reason completed \
         --comment "Concluída no PR #$N, mesclado na \`develop\`. Chega à \`main\` com a próxima release." \
         && gh api "repos/{owner}/{repo}/issues/$i" --jq '"#\(.number): \(.state) (\(.state_reason))"'
     else
       echo "#$i aberta e citada no corpo do PR: confirmar com o usuário antes de fechar"
     fi
   done
   ````

   - **Referência confirmada:** fechar com o mesmo `gh issue close` e conferir
     com o `gh api` do laço.
   - **Shell:** `while read` e `<<<` funcionam em bash e zsh; um `for` sobre
     variável sem aspas não separa as palavras no zsh.
   - **Motivo do fechamento:** o `gh issue view` desta versão não expõe; confere
     pelo `gh api` (`state_reason`).
   - **PR de release** (`develop` → `main`): não precisa deste passo, porque o
     merge na branch padrão fecha as issues.

6. **PR de release:** acrescentar o PR mesclado à lista e o `Closes #<issue>` na
   descrição do PR de release aberto (`develop` → `main`), para rastreabilidade.

7. **Relatar:** branch atual, commit de merge, issue fechada, branch e worktree
   removidas.

## Merge de release (`develop` → `main`)

1. **Antes de pedir o OK:** rodar a skill
   [`release-check`](../skills/release-check/SKILL.md) na `develop` e registrar
   o resultado na descrição do PR de release. Se a `develop` mudar depois,
   refazer a checagem, ou registrar que o diff novo não toca código, build nem
   dependências (`git diff --stat <commit verificado> origin/develop`).

2. **Com o OK explícito, mesclar sem `--delete-branch`** (apagaria a `develop`):

   ```bash
   gh pr merge <N> --merge
   git ls-remote --heads origin develop   # a develop continua lá
   ```

3. **Acompanhar o workflow Release** até terminar:
   - semantic-release: tag, `CHANGELOG.md`, release no GitHub e commit
     `chore(release): <versão> [skip ci]` na `main`;
   - imagem Docker no GHCR.

   Não há deploy automático.

   ```bash
   # Espera o run do commit de merge (não o de uma release anterior)
   MERGE=$(gh pr view <N> --json mergeCommit -q .mergeCommit.oid)
   until RUN=$(gh run list --workflow release.yml --branch main --limit 5 --json databaseId,headSha \
       -q ".[] | select(.headSha == \"$MERGE\") | .databaseId") && [ -n "$RUN" ]; do sleep 5; done
   gh run watch "$RUN" --exit-status
   git fetch origin --tags && git tag -l 'v*'
   gh release view v<versão>
   JOB=$(gh run view "$RUN" --json jobs -q '.jobs[] | select(.name | test("Docker")) | .databaseId')
   gh run view --job "$JOB" --log | grep -oE 'ghcr.io/[^ ]+:(<versão>|latest)@sha256:[0-9a-f]{12}' | sort -u
   ```

   A imagem é conferida pelo log do job: o token local do `gh` não tem
   `read:packages` para listar o pacote.

4. **Sincronizar a `develop`** com a `main`, que ficou à frente com o merge e o
   `chore(release)`. Sem isso, a próxima release parte de versão e changelog
   desatualizados.
   1. **Abrir o PR:**

      ```bash
      git rev-list --left-right --count origin/develop...origin/main   # "0 N": develop só atrás
      gh pr create --base develop --head main --assignee @me \
        --title "chore(release): sincroniza develop com a main após a v<versão>"
      ```

   2. **Validar localmente:** o topo da `main` tem `[skip ci]`, então **a CI não
      roda neste PR**. Rodar numa worktree destacada da `main` os mesmos passos
      da CI e registrar o resultado num comentário do PR:

      ```bash
      W="$(mktemp -d)/sync"; git worktree add --detach "$W" origin/main && cd "$W"
      bun install --frozen-lockfile && bun run security:check && bun run lint \
        && bun run format:check && bun run typecheck && bun test && bun --bun run build
      cd - && git worktree remove --force "$W"
      ```

   3. **Mesclar sem `--delete-branch`** (apagaria a `main`) e atualizar a
      `develop` local:

      ```bash
      gh pr merge <N> --merge
      git checkout develop && git pull --ff-only origin develop
      ```

   4. **Conferir:** `git rev-list --left-right --count origin/develop...origin/main`
      deve mostrar `1 0` (a `develop` só tem o merge a mais).

   O merge para a `develop` já está autorizado pela tabela do início; a
   validação local substitui a CI só neste caso.

## Regras

- ❌ Nunca `push --force` em `develop` ou `main`, nem commit direto nelas.
- ❌ Nunca mesclar release sem OK explícito.
- ✅ `--delete-branch` em todo PR de branch de trabalho (`tipo/<número>`).
- ❌ **Nunca** `--delete-branch` quando a origem do PR é `develop` (release) ou
  `main` (sincronização).
