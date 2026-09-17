---
description: Encadeia issue, branch/worktree, commit, review, PR, checks e merge seguindo os comandos canônicos do projeto.
argument-hint: "[o que fazer, ou a etapa de onde continuar]"
---

# Fluxo completo

Orquestra os comandos do projeto **em sequência**. Em cada etapa, **abra o
arquivo canônico e siga o workflow dele**: não resuma de memória, e cite as
seções ao reportar ao usuário.

Contexto do projeto: [`AGENTS.md`](../../AGENTS.md).

## Como agir

1. Inspecionar o estado: branch atual, `git status`, worktrees
   (`git worktree list`), PR aberto da branch.
2. Executar só as etapas que faltam (ver a tabela no fim).
3. Pedir confirmação onde o comando exige: mensagens de commit, criação do PR
   e merge de release. Se o usuário já autorizou o fluxo completo, informar o
   que foi feito em cada etapa.

---

## 1) Issue e branch

**Canônico:** [`branch.md`](./branch.md). Em paralelo a outro trabalho:
[`worktree.md`](./worktree.md).

- Sem issue: criar a issue primeiro.
- Branch `tipo/<número>` a partir da `develop`.

## 2) Implementação

- Seguir o `AGENTS.md`: regras de conteúdo, SEO, componentes shadcn, MVVM
  (feature nova: [`scaffold-feature.md`](./scaffold-feature.md)).
- Testes junto com o código.

## 3) Commit

**Canônico:** [`commit.md`](./commit.md).

- Validar (`format:check`, `lint`, `typecheck`, `test`) antes de gravar.
- Conventional Commits agrupados por contexto.

## 4) Review

**Canônico:** [`review.md`](./review.md) e o agente
[`code-reviewer`](../agents/code-reviewer.md).

- Rodar o agente contra `develop...HEAD`.
- Críticos resolvidos antes do PR (ou exceção aceita pelo usuário).
- Mudança visual ou de rota: skills [`smoke-test`](../skills/smoke-test/SKILL.md)
  e [`seo-audit`](../skills/seo-audit/SKILL.md).

## 5) Pull request

**Canônico:** [`pr.md`](./pr.md).

- Base `develop`, descrição com resumo, o que muda, verificação e `Closes #N`.

## 6) Checks do PR

**Canônico:** skill [`pr-checks`](../skills/pr-checks/SKILL.md).

- Acompanhar até verde; corrigir falhas da branch e repetir.
- PR que só toca `.claude/**`, `.cursor/**`, `AGENTS.md` ou `CLAUDE.md` não roda
  CI: não há o que acompanhar.

## 7) Merge

**Canônico:** [`merge.md`](./merge.md).

- PR para `develop`: mesclar com a CI verde.
- Limpar branch e worktree; atualizar o PR de release com o `Closes #N`.

---

## Ordem típica

| Momento                      | Etapas                    |
| ---------------------------- | ------------------------- |
| Trabalho novo                | 1 → 2 → 3 → 4 → 5 → 6 → 7 |
| Código pronto, falta fechar  | 3 → 4 → 5 → 6 → 7         |
| PR aberto com CI falhando    | 6 → 7                     |
| Trabalho em paralelo a outro | 1 (worktree) → 2 → … → 7  |
