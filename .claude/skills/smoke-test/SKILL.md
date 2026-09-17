---
name: smoke-test
description: Smoke test visual do elvisea.dev com chrome-devtools-mcp — percorre as rotas principais nos temas claro e escuro, em 400 px e 1280 px, tira screenshots e aponta erro de console, rolagem horizontal e tela quebrada. Use quando pedirem para "rodar um smoke test", "ver se o site está de pé", "conferir as telas" ou antes de um PR com mudança visual.
argument-hint: "[rotas separadas por espaço, padrão todas] [--base http://127.0.0.1:3000]"
---

# Smoke test visual

Percorre as rotas e sinaliza o que quebrou. Não altera código.

## Alvo

- **Padrão:** o dev server do usuário em `http://localhost:3000`. Não reiniciar
  nem matar esse processo.
- **Build de produção**, para uma verificação fiel antes de PR ou release:

  ```bash
  bun --bun run build
  cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public
  (cd .next/standalone && PORT=3102 HOSTNAME=127.0.0.1 EMAIL_TRANSPORT=console node server.js)
  ```

  Rodar em segundo plano, testar em `http://127.0.0.1:3102` e encerrar com
  `fuser -k 3102/tcp` no fim.

## Rotas padrão

`/`, `/experiencia`, `/servicos`, uma página de serviço (`/servicos/chatbot-ia-whatsapp`),
`/projetos`, `/sobre`, `/como-trabalho`, `/curriculo`, `/contato`,
`/contato?assunto=projeto&servico=pagamentos-pix`, `/blog`, `/rota-inexistente`
(deve mostrar a 404).

Com posts publicados, incluir o post mais recente.

## Passos

1. Abrir uma aba nova (`new_page`); não reaproveitar abas do usuário.
2. Para cada combinação `viewport × tema`:
   - `emulate` com `viewport` `400x860x2,mobile,touch` ou `1280x900x1`, e
     `colorScheme` `light` ou `dark`;
   - para cada rota:
     1. `navigate_page`;
     2. `list_console_messages` filtrando `error` e `warn`;
     3. `evaluate_script` com
        `() => ({ scroll: document.documentElement.scrollWidth > document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length })`;
     4. `take_screenshot` salvo no diretório de rascunho da sessão (nunca dentro
        do repositório).
3. Olhar os screenshots das rotas com mudança no PR (as demais, por amostragem).

## Relatório

Tabela: rota | 400 claro | 400 escuro | 1280 claro | 1280 escuro | observação.

- 🟢 sem erro de console, sem rolagem horizontal e com exatamente um `h1`;
- 🟡 aviso de console ou detalhe visual;
- 🔴 erro, rolagem horizontal, `h1` ausente ou duplicado, tela quebrada.

Listar o caminho dos screenshots e descrever cada 🔴 com a causa provável e o
arquivo onde olhar.

## Notas

- Ignorar ruído de extensão do Chrome e de HMR do dev server.
- `NoFallbackError` no log do servidor standalone em 404 de rota com
  `dynamicParams = false` é comportamento do Next, não falha.
