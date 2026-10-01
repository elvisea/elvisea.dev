# QA — elvisea.dev

Lido por `qa:smoke`, `qa:perf`, `qa:errors`, `qa:seo` e `qa:release-check`.
Regras de referência: `AGENTS.md` § SEO, § Estilo visual e `docs/SEO.md`.

## Alvo

- **Dev server:** o do usuário em `http://localhost:3000` (`app.url`). Num
  worktree, a porta vem do `wt env`. Não reiniciar nem matar esse processo.
- **Build de produção** (smoke antes de PR com mudança visual, `qa:perf`,
  `qa:seo`): standalone na porta **3102**, para não colidir com o dev server.
  Se a 3102 estiver ocupada, use uma porta livre.

  ```bash
  bun --bun run build
  cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public
  (cd .next/standalone && PORT=3102 HOSTNAME=127.0.0.1 EMAIL_TRANSPORT=console bun server.js)
  ```

  Rodar em segundo plano, testar em `http://127.0.0.1:3102` e encerrar o
  processo iniciado no fim.

- **Imagem Docker** (`qa:release-check`): container na porta **3103**
  (`-p 127.0.0.1:3103:3000`), com healthcheck esperado `healthy`.

## Build de produção — variáveis

- `EMAIL_TRANSPORT=console`: o formulário de contato loga o e-mail em vez de
  enviar. Sem a variável, o formulário responde erro em produção.
- Nenhuma outra variável é necessária para subir. Nunca use credencial real
  (`SMTP_*`, `GITHUB_TOKEN`).

## Viewports e temas

- 400 px (`400x860x2,mobile,touch`) e 1280 px (`1280x900x1`).
- O site tem tema claro e escuro (`next-themes`): testar os dois sempre
  (`colorScheme` `light` e `dark`).
- 🟢 exige: sem erro de console, sem rolagem horizontal e **exatamente um
  `h1`**.

## Rotas

`/`, `/experiencia`, `/servicos`, uma página de serviço
(`/servicos/chatbot-ia-whatsapp`), `/projetos`, `/sobre`, `/como-trabalho`,
`/curriculo`, `/contato`, `/contato?assunto=projeto&servico=pagamentos-pix`,
`/blog`, `/rota-inexistente` (deve mostrar a 404).

Com posts publicados, incluir o post mais recente (`/blog/<slug>`).

`qa:seo` padrão: as rotas alteradas, `/`, `/sobre` e `/servicos`.

## SEO (`qa:seo`)

- `<title>` com até 60 caracteres (com o sufixo ` · Elvis Amancio`),
  `meta description` entre 70 e 160, exatamente um `<h1>`, `canonical` com o
  caminho da própria rota.
- `robots`: `index, follow`; `noindex` só onde a regra manda (`/blog` sem
  posts).
- JSON-LD (`@graph`) esperado:

  | Rota               | Nós                                    |
  | ------------------ | -------------------------------------- |
  | Todas              | `WebSite` e `Person`                   |
  | Internas           | `BreadcrumbList` começando em "Início" |
  | `/sobre`           | `ProfilePage`                          |
  | `/servicos/<slug>` | `Service`, com `provider` = `/#person` |
  | `/blog/<slug>`     | `BlogPosting`, com autor por `@id`     |

  ```bash
  curl -s "$B$ROTA" | grep -o '<script type="application/ld+json">[^<]*</script>' \
    | sed 's/<script[^>]*>//; s/<\/script>//' | jq '."@graph"[] | {"@type", "@id"}'
  ```

- Sitemap sem as rotas `noindex`; `robots.txt` apontando para o sitemap.
- **Redirects 308** (rotas antigas em inglês): `/experiences`,
  `/experiences/x`, `/projects`, `/projects/x` e `/contact` vão para a rota
  nova.
- **Termos proibidos** no HTML gerado (regras de conteúdo do `AGENTS.md`):

  ```bash
  find .next/server/app -name '*.html' -print0 | xargs -0 grep -oiE \
    "viki|stayclose|lottopar|aerobi|probitech|licita[çc]|sal[aá]rio" | sort | uniq -c
  ```

  "solicitações" contém "licitaç": conferir o contexto antes de reportar.

- **Lighthouse:** meta de 100 em SEO e acessibilidade, em mobile e desktop.

## Release (`qa:release-check`)

- Status HTTP esperado no container (`http://127.0.0.1:3103`):

  | Status | Rotas                                                                                                                                                          |
  | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 200    | `/`, páginas internas, `/servicos` e cada serviço, `/contato` com parâmetros, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, PDFs do currículo |
  | 308    | `/experiences`, `/projects/x`, `/contact`                                                                                                                      |
  | 404    | `/servicos/nao-existe`, `/nao-existe`                                                                                                                          |

- `bun run security:check` (`bun audit --audit-level=high`).
- Release simulada:
  `GITHUB_TOKEN="$(gh auth token)" bunx semantic-release --dry-run --no-ci --branches develop`.
- O resultado vai para a seção "Verificação" do PR de release. Se a `develop`
  mudar depois, refazer a checagem ou registrar que o diff novo não toca
  código, build nem dependências
  (`git diff --stat <commit verificado> origin/develop`).

## Servidor e logs

- Erro de Server Action ou de renderização aparece no terminal do Next. Os
  eventos do formulário saem em JSON pelo `logger` (`contact.validation_failed`,
  `contact.send_failed`…). Sem acesso ao terminal, pedir o trecho ao usuário.

## Casos conhecidos

| Sintoma                                                                           | Causa e correção                                                                                                  |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `A component is changing the default value state of an uncontrolled FieldControl` | `defaultValue` mudou depois de montar: remontar os campos com `key` derivada dos valores (ver `contact-form.tsx`) |
| `Detected scroll-behavior: smooth on the <html> element`                          | `data-scroll-behavior="smooth"` no `<html>` (`app/layout.tsx`)                                                    |
| `useSearchParams() should be wrapped in a suspense boundary`                      | componente com `useSearchParams` fora de `Suspense` numa página estática                                          |
| Hidratação divergente                                                             | valor que só existe no navegador (data, `Date.now()`, `window`) lido no render: mover para efeito                 |
| `NoFallbackError` no log do standalone em 404                                     | comportamento do Next em rota com `dynamicParams = false`, não é falha                                            |

## Perf (`qa:perf`)

- Por padrão, medir `/` e a rota alterada.
- Suspeitos comuns no bundle de cliente: ícones importados em bloco,
  bibliotecas de highlight/markdown no cliente.
