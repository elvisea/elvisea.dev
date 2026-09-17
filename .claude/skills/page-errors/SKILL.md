---
name: page-errors
description: Diagnostica erros de uma página com chrome-devtools-mcp — coleta erros e avisos do console, requisições com falha (4xx/5xx, bloqueadas, canceladas) e o log do servidor, reproduz a ação que causa o erro e aponta a causa provável no código. Use quando pedirem para "ver os erros da página", "checar o console", "por que essa tela dá erro" ou quando o usuário colar um aviso do navegador.
argument-hint: "<rota ou URL> [ação para reproduzir]"
---

# Erros de página

## Alvo

- Rota relativa: prefixar com `http://localhost:3000` (dev server do usuário;
  não reiniciar).
- Sem rota informada: perguntar qual página inspecionar.

## Passos

1. **Abrir** a página numa aba nova (`new_page`) e esperar estabilizar
   (`wait_for` quando houver conteúdo dinâmico).
2. **Console:** `list_console_messages` filtrando `error`, `warn` e `issue`;
   `get_console_message` para ver a pilha completa dos relevantes.
3. **Rede:** `list_network_requests` e, para cada status 4xx/5xx, bloqueio ou
   cancelamento relevante, `get_network_request` com cabeçalhos e corpo.
4. **Reproduzir** a ação quando o erro depende de interação: `take_snapshot`,
   depois `click`, `fill` ou `press_key` pelo `uid`, e coletar console e rede de
   novo. **Não** clicar em nada que abra `alert`/`confirm`.
5. **Servidor:** o erro de Server Action ou de renderização aparece no terminal
   do Next. Os eventos do formulário saem em JSON pelo `logger`
   (`contact.validation_failed`, `contact.send_failed`…). Pedir o trecho ao
   usuário se o terminal não estiver acessível.
6. **Localizar** a causa no código com a mensagem exata (Grep), conferindo a
   documentação da versão em `node_modules/next/dist/docs/` quando o aviso
   vier do Next ou do React.

## Relatório

- **Resumo:** quantos erros de console e quantas falhas de rede.
- **Console:** mensagem, origem (`arquivo:linha` quando houver) e causa
  provável.
- **Rede:** método, URL, status e o que o corpo da resposta indica.
- **Diagnóstico:** hipótese de causa raiz, arquivo e proposta de correção
  (sem aplicar sem o usuário pedir).

## Casos já vistos neste projeto

| Sintoma                                                                           | Causa e correção                                                                                                  |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `A component is changing the default value state of an uncontrolled FieldControl` | `defaultValue` mudou depois de montar: remontar os campos com `key` derivada dos valores (ver `contact-form.tsx`) |
| `Detected scroll-behavior: smooth on the <html> element`                          | `data-scroll-behavior="smooth"` no `<html>` (`app/layout.tsx`)                                                    |
| `useSearchParams() should be wrapped in a suspense boundary`                      | componente com `useSearchParams` fora de `Suspense` numa página estática                                          |
| Hidratação divergente                                                             | valor que só existe no navegador (data, `Date.now()`, `window`) lido no render: mover para efeito                 |
