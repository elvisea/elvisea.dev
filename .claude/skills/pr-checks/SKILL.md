---
name: pr-checks
description: Acompanha os checks do GitHub Actions de um pull request até ficarem verdes — espera a CI, lê o log do job que falhou, separa falha da branch de instabilidade externa, corrige, faz push e repete. Use logo depois de abrir ou atualizar um PR, ou quando pedirem para "acompanhar a CI", "ver por que o PR falhou" ou "deixar o PR verde".
argument-hint: "[número do PR, padrão o da branch atual]"
---

# Checks do PR

Mantém o PR sob acompanhamento até a CI passar ou até surgir um bloqueio que
exija decisão humana. Não para enquanto houver check `pending`.

## CI deste repositório

Workflow `ci.yml`, em PRs para `develop` e `main`:

| Job                                  | O que roda                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| **Security**                         | `bun audit` (alta ou crítica) e Trivy (Dockerfile, compose, CVEs e segredos) |
| **Lint, Format, Types, Test, Build** | `lint`, `format:check`, `typecheck`, `bun test`, build                       |
| **GitGuardian Security Checks**      | app externo: varredura de segredos                                           |

Mudanças só em `.claude/**`, `.cursor/**`, `AGENTS.md` ou `CLAUDE.md` não
disparam a CI (`paths-ignore`). Sem checks, não há o que acompanhar.

## Procedimento

1. **Resolver o PR:** número em `$ARGUMENTS` ou

   ```bash
   gh pr list --head "$(git branch --show-current)" --json number,url,state
   ```

2. **Esperar os checks** (a lista pode demorar alguns segundos para aparecer):

   ```bash
   until gh pr checks <N> 2>/dev/null | grep -q .; do sleep 5; done
   gh pr checks <N> --watch --interval 20
   gh pr checks <N>
   ```

   Em sessão do Claude Code, prefira rodar a espera em segundo plano e seguir
   com outra tarefa até a notificação.

3. **Se algo falhar, ler o log:**

   ```bash
   gh run list --branch "$(git branch --show-current)" --limit 5
   gh run view <run-id> --log-failed
   ```

4. **Classificar a falha:**

   - **Da branch** (lint, formatação, tipos, teste, build em arquivo tocado,
     `bun audit` por dependência adicionada no PR):
     1. reproduzir localmente;
     2. corrigir;
     3. validar;
     4. commit `fix(<escopo>): …`, `test: …` ou `chore(deps): …`;
     5. push;
     6. voltar ao passo 2.
   - **Externa ou instável** (timeout de rede, indisponibilidade do GitHub,
     vulnerabilidade nova numa dependência transitiva que o PR não trouxe):
     - não fazer mudança ampla para contornar;
     - no máximo **um** rerun (`gh run rerun <run-id> --failed`) quando for
       claramente instabilidade;
     - se persistir, reportar ao usuário com o trecho do log.

5. **Review humano:** comentário acionável e correto no PR vem antes de rerun
   cego; o commit novo já dispara a CI. Não responder comentário de pessoa sem
   confirmação do usuário.

6. **Parar quando:**
   - todos os checks passaram (informar e seguir para o `/merge`);
   - o PR foi mesclado ou fechado;
   - há bloqueio que depende de humano (permissão, decisão de produto, segredo
     ausente);
   - o usuário interrompeu.

## Lembretes

- Nunca `git push --force` para "limpar" histórico durante o acompanhamento.
- Nunca desativar um check ou pular teste para ficar verde.
- Falha de `format:check`: `bunx --bun prettier --write <arquivos>` só nos
  arquivos do PR.
