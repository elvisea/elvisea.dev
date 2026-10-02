## O que foi feito

-

## Para revisar

<!-- Texto público novo, decisão que o dono precisa confirmar, risco conhecido. Omitir se não houver. -->

## Issue relacionada

Closes #

## Tipo de mudança

- [ ] Nova funcionalidade (feat)
- [ ] Correção de bug (fix)
- [ ] Refatoração (refactor)
- [ ] Manutenção (chore)
- [ ] Documentação (docs)
- [ ] Hotfix em produção (hotfix)

## Verificação

<!-- Só o que foi realmente executado: comandos e resultado (gates, testes, build), o que foi conferido no navegador ou no build de produção. No PR de release, o relatório do qa:release-check. -->

-

## Checklist

- [ ] Revisão de código (`/flow:review` ou agente `code-reviewer`) sem pontos **críticos** pendentes
- [ ] `gates` verde: `bun audit`, `format:check`, `lint`, `typecheck`, `bun test` e `bun --bun run build`
- [ ] Responsividade e temas claro e escuro verificados (`qa:smoke`) quando há UI
- [ ] Sem `.env`, segredos ou dados sensíveis no diff
- [ ] Commits no padrão adotado na `main` (**Conventional Commits** — usado pelo **semantic-release**)
- [ ] Se alterou Dockerfile ou compose: `docker compose`/build local validado
