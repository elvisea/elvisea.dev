---
description: Mescla o PR verde (merge commit), fecha a issue, limpa branch e worktree locais e mantém o PR de release em dia.
argument-hint: "[número do PR]"
disable-model-invocation: true
---

# Merge e pós-merge

## Quem autoriza

| PR                           | Merge                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| Para `develop`               | autorizado pelo dono do repositório assim que a CI passa     |
| Release `develop` → `main`   | **só com OK explícito** do dono (gera tag, release e imagem) |
| Correção urgente para `main` | só com OK explícito                                          |

Sem CI verde ou com conflito, não mesclar em nenhum caso.

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

   `--squash`/`--rebase` só se o usuário pedir.

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
   de um PR para `develop` não fecha a issue sozinho. Fechar aqui cada issue do
   `Closes #N` do PR (em geral o número da branch: `chore/37` → #37):

   ```bash
   gh pr view <N> --json body -q .body | grep -oE 'Closes #[0-9]+'
   gh issue view <issue> --json state -q .state
   gh issue close <issue> --reason completed \
     --comment "Concluída no PR #<N>, mesclado na \`develop\`. Chega à \`main\` com a próxima release."
   ```

   Issue já `CLOSED`: nada a fazer. PR de release (`develop` → `main`) não
   precisa deste passo, porque o merge na branch padrão fecha as issues.

6. **PR de release:** acrescentar o PR mesclado à lista e o `Closes #<issue>` na
   descrição do PR de release aberto (`develop` → `main`), para rastreabilidade.

7. **Relatar:** branch atual, commit de merge, issue fechada, branch e worktree
   removidas.

## Merge de release (`develop` → `main`)

Antes de pedir o OK, rodar a skill [`release-check`](../skills/release-check/SKILL.md)
na `develop` e registrar o resultado na descrição do PR de release. O merge
dispara o semantic-release (tag, `CHANGELOG.md`, release no GitHub) e a
publicação da imagem no GHCR. Não há deploy automático.

## Regras

- ❌ Nunca `push --force` em `develop` ou `main`, nem commit direto nelas.
- ❌ Nunca mesclar release sem OK explícito.
- ✅ Sempre `--delete-branch`.
