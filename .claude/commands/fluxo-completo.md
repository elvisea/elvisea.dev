# Fluxo completo Git (branch → commit → review → PR)

Orquestra **em sequência** os quatro fluxos já documentados nos comandos
atômicos. Para cada etapa aplicável ao estado atual (`git status`, branch,
diff), **abra o arquivo canon correspondente e siga o workflow completo ali**
antes de avançar.

Contexto stack/marca: [`AGENTS.md`](../../AGENTS.md)

---

## Como o assistente deve agir

1. Inspecionar o estado: branch atual (`git branch --show-current`), working
   tree staged/unstaged, remoto.
2. Executar apenas os passos **relevantes** — se o usuário já está em branch
   correta e só quer fechar PR, pode enfatizar 2 → 3 → 4.
3. Em cada passo, **não resumir de memória** o que está nos arquivos canon:
   use-os como checklist e citar seções quando reportar ao usuário.

---

## 1) Branch

**Canon:** [`branch.md`](./branch.md)

- Sem issue aberta para o trabalho: **criar issue no GitHub primeiro**, depois
  ramificar no formato **`tipo/<número>`** — ver **§ Issue antes da branch** em
  `branch.md`.
- **Incluir** quando: criar ramo novo, validar convenção de nome ou alinhar
  base (`develop` / `main`) conforme tipo.
- **Pular** quando: branch já está no padrão e o usuário confirmou que não haverá
  mudança de ramo nesta sessão.

---

## 2) Commit

**Canon:** [`commit.md`](./commit.md)

- Agrupar mudanças, mensagens Conventional Commits, confirmação explícita antes
  de gravar commits.
- Só gravar commits após o usuário **aprovar** as mensagens propostas.

---

## 3) Review

**Canon:**

- [`review.md`](./review.md) — checklist
- [`../agents/code-reviewer.md`](../agents/code-reviewer.md) — formato de saída
  (severidades + `arquivo:linha`)

- Rodar contra o diff atual (working tree ou commits ainda não pushed,
  conforme combinar com o usuário).
- **Críticos** devem ser tratados antes de abrir ou atualizar PR (ou documentar
  exceção aceita pelo usuário).

---

## 4) Pull Request

**Canon:** [`pr.md`](./pr.md)

- Checks (`bun` lint/format/build/test onde couber), descrição, base (`develop`
  habitual), `Closes #N` se aplicável.
- Confirmar URL do remoto (`gh repo view`) antes de `gh pr create`.

---

## Ordem “típica” (guia)

| Momento do trabalho       | Passos costumam ser…     |
| ------------------------- | ------------------------ |
| Início de feature         | 1 → (código) → 2 → 3 → 4 |
| Só fechar após codar      | 2 → 3 → 4                |
| Ramo já certo, só revisar | 3 → (ajustes) → 2 → 4    |

Ajuste conforme o que o usuário pedir na mensagem que invocou este fluxo.
