---
description: Cria, lista ou remove uma git worktree para trabalhar numa issue em paralelo (outra tarefa, outro agente ou um dev server separado).
argument-hint: "[criar <tipo>/<número> | listar | remover <número>]"
---

# Worktree

Uma **git worktree** é uma segunda pasta de trabalho do mesmo repositório, com
branch, arquivos, `node_modules` e `.next` próprios, e o mesmo histórico e
remoto. Serve para trabalhar em duas coisas ao mesmo tempo sem `stash` e sem um
agente mexer nos arquivos de outro.

## Quando usar

- Duas issues em andamento ao mesmo tempo (ou dois agentes).
- Revisar ou testar um PR sem largar o trabalho atual.
- Rodar um segundo `next dev`: o Next 16 recusa dois dev servers na mesma pasta.
- Verificar a `develop` "limpa" antes de uma release.

Para uma tarefa por vez, a branch na pasta principal basta
([`branch.md`](./branch.md)).

## Dois tipos, dois lugares

| Tipo                              | Onde                                                  | Quem cria                                                                     |
| --------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| Trabalho que vira PR              | **ao lado** do repositório: `../elvisea.dev-<número>` | este comando (`git worktree add`)                                             |
| Isolamento efêmero do Claude Code | `.claude/worktrees/<nome>/`                           | `claude --worktree`, o `EnterWorktree` e subagentes com `isolation: worktree` |

- Worktree de trabalho fica **fora** da árvore do repositório, para o ESLint, o
  Next e os buscadores da pasta principal não a varrerem.
- `.claude/worktrees/` é ignorado pelo git e pelo ESLint. O Claude Code remove
  as worktrees sem mudanças e varre as antigas sozinho.
- O `.claude/settings.json` define `worktree.baseRef: "head"`: as worktrees do
  Claude Code partem do `HEAD` atual. Sem isso partiriam da branch padrão
  (`main`), que fica atrás da `develop`.
- `.worktreeinclude` copia `.env` e `.env.local` para as worktrees criadas pelo
  Claude Code. Nas criadas à mão, copie você.

## Criar (trabalho que vira PR)

```bash
N=35; TIPO=chore
git fetch origin develop
git worktree add -b "$TIPO/$N" "../elvisea.dev-$N" origin/develop
cd "../elvisea.dev-$N"
bun install --frozen-lockfile
cp ../elvisea.dev/.env.local . 2>/dev/null || true   # se existir
bun run dev --port 3001                               # a pasta principal usa a 3000
```

- **Dependências:** `bun install` em cada worktree. É rápido porque o Bun
  reaproveita o cache global.
  - **Não** criar symlink de `node_modules` para a pasta principal: o
    Turbopack do Next 16 falha com
    `Symlink [project]/node_modules is invalid, it points out of the filesystem root`.
- A issue já deve existir e a branch segue `tipo/<número>`.
- Uma branch só pode estar em uma worktree por vez (`fatal: '<branch>' is
already used by worktree`).
  - Para inspecionar a `develop` sem tirá-la da pasta principal:
    `git worktree add --detach ../elvisea.dev-verificacao develop`.

## Trabalhar

- Commits, push e PR saem da própria worktree
  ([`commit.md`](./commit.md), [`pr.md`](./pr.md)); o histórico é compartilhado.
- Abrir o agente dentro da worktree (`cd ../elvisea.dev-<número> && claude`).
- Antes do PR: `git fetch origin && git merge origin/develop` e validar de novo.

## Listar

```bash
git worktree list
```

## Remover (depois do merge)

```bash
cd ../elvisea.dev
git worktree remove "../elvisea.dev-$N"   # recusa se houver mudança não commitada
git branch -d "$TIPO/$N"
git worktree prune
```

- Worktree com mudanças não salvas: **não** usar `--force` sem confirmar com o
  usuário que o trabalho pode ser descartado.
- Worktree travada (`locked`) por uma sessão do Claude Code em andamento:
  esperar a sessão terminar. `git worktree unlock` só se a sessão já tiver
  morrido.

## Regras

- Um agente ou uma tarefa por worktree; nunca dois agentes editando a mesma
  pasta.
- Worktree de trabalho sempre como irmã do repositório, nunca dentro dele.
- Cada worktree com o próprio `bun install` e a própria porta de dev server.
