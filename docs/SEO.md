# SEO

Regras curtas no [AGENTS.md § SEO](../AGENTS.md#seo). Este documento traz o
porquê, o mapa de termos, o modelo de página de serviço e o checklist de
lançamento.

## Públicos e o que cada um procura

| #   | Público                                    | Como chega                                   | O que precisa encontrar                        |
| --- | ------------------------------------------ | -------------------------------------------- | ---------------------------------------------- |
| 1   | Recrutadores, RH, CEOs, CTOs, contratantes | Busca pelo nome, link do LinkedIn, currículo | Cargo, experiência, currículo, contato         |
| 2   | Empresas que buscam um serviço             | Google, com o problema que querem resolver   | O serviço, provas de que já foi feito, contato |
| 3   | Técnicos e desenvolvedores                 | LinkedIn, busca técnica de cauda longa       | Projetos, posts técnicos, como trabalho        |

O público 1 quase sempre já sabe o nome; o site precisa **ranquear pelo nome** e
converter rápido (currículo e contato acima da dobra). O público 2 **não sabe o
nome**: só chega por termos de serviço, e é o que exige páginas dedicadas.

## Método

Adaptado do planejamento de palavras-chave usado em campanhas de Google Ads:

1. **Uma intenção por página.** Cada página responde uma busca. Duas páginas
   disputando o mesmo termo se canibalizam.
2. **Termos com intenção de contratação** para páginas de serviço ("desenvolvimento
   de…", "empresa de…", "contratar…"); termos informacionais ("como…", "o que é…")
   vão para o blog, que liga para o serviço.
3. **Termos negativos:** o que não perseguir, para não atrair visita que não
   converte.
4. **Busca, página e chamada alinhadas:** o termo aparece no título, no H1 e na
   descrição da página que o atende.

Todos os termos abaixo são **hipóteses**. Nenhum volume de busca foi medido.
Validar com o Planejador de Palavras-chave do Google Ads e, depois do
lançamento, com as consultas reais do Search Console.

## Mapa de termos (hipóteses)

### Público 1 — nome e avaliação

| Intenção            | Exemplos de busca                                                                             | Página                              |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| Nome                | elvis amancio · elvis erison amancio · elvisea                                                | `/`                                 |
| Avaliação           | elvis amancio currículo · elvis amancio github · elvis amancio linkedin                       | `/curriculo`, `/projetos`, `/sobre` |
| Perfil profissional | desenvolvedor full-stack sênior curitiba · desenvolvedor nestjs sênior · desenvolvedor elixir | `/`, `/experiencia`                 |

Termos genéricos de cargo são muito disputados (portais de vagas). Servem como
reforço, não como aposta principal.

### Público 2 — serviços

| Serviço (página)          | Comercial                                                           | Comercial com modificador                        | Informacional (blog → serviço)                |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| Chatbot com IA e WhatsApp | desenvolvimento de chatbot com IA · chatbot para whatsapp com IA    | chatbot com IA para clínica · … para atendimento | como funciona um chatbot com IA no whatsapp   |
| Automação e integração    | automação de processos empresariais · integração de sistemas        | integração com ERP · automação com IA            | como integrar sistemas legados                |
| Pagamentos com PIX        | integração pix em sistema · pix automático para assinaturas         | integração pix com gateway                       | como funciona o pix automático                |
| Sistemas web e SaaS       | desenvolvimento de sistema web sob medida · desenvolvimento de saas | sistema web para empresa em curitiba             | quanto tempo leva para desenvolver um sistema |
| Aplicativos mobile        | desenvolvimento de aplicativo · criar aplicativo para empresa       | aplicativo react native · aplicativo offline     | aplicativo que funciona sem internet          |
| Modernização de legado    | modernização de sistema legado · migração de sistema                | migrar jquery para react · sair do firebase      | quando reescrever um sistema legado           |
| Infraestrutura e DevOps   | consultoria devops · configuração de servidores                     | automação com ansible · ci/cd para startup       | ansible para pequenas empresas                |

"Curitiba" entra só como modificador numa frase da página ("Curitiba, com
atendimento remoto em todo o Brasil"). **Nunca** criar uma página por cidade.

### Público 3 — técnico (cauda longa)

Posts sobre trabalho real: roles de Ansible, migração do Firebase para
PostgreSQL, aplicativo offline-first com sincronização, BFF sobre sistema legado,
Elixir em produção. Cada post liga para o projeto, a experiência ou o serviço
relacionado.

## Termos negativos

Não criar página nem conteúdo para atrair:

- **Quem procura aprender, não contratar:** curso, tutorial para iniciantes,
  grátis, gratuito, template, download, código-fonte pronto.
- **Quem procura emprego:** vaga, salário, estágio (no contexto de serviços).
- **Serviços que não são oferecidos:** disparo em massa, envio em massa de
  mensagens, clonar WhatsApp, bot de spam, compra de seguidores.
- **Promessas que o conteúdo não faz:** API oficial do WhatsApp (as integrações
  usam API não oficial, e isso é dito nas páginas), preço, prazo garantido.

## Modelo de página de serviço

- **URL:** `/servicos/<slug>` com o termo principal em português, sem acento
  (ex.: `chatbot-ia-whatsapp`).
- **Título:** termo principal + nome, com até 60 caracteres no total.
- **H1:** o serviço como é buscado ("Chatbot com IA e atendimento no
  WhatsApp").
- **Descrição (70–160):** o que é feito, para quem e onde (remoto, Brasil).
- **Seções, nesta ordem:**
  1. resumo em duas ou três frases;
  2. para quem é;
  3. o que é entregue;
  4. como funciona (etapas);
  5. **evidências:** experiências e projetos em que isso já foi feito, com link
     para `/experiencia#<slug>` ou `/projetos`;
  6. tecnologias (chaves de `stack.ts`);
  7. perguntas frequentes só com fatos: sem preço, prazo ou garantia;
  8. chamada para o contato com o serviço já selecionado.
- **Dados estruturados:** `Service` (`provider` = pessoa por `@id`,
  `areaServed` = Brasil) e `BreadcrumbList`. Sem `FAQPage`: desde 2023 o Google
  só mostra esse resultado para sites de governo e saúde.
- **Links internos:** a home e o menu levam ao catálogo; posts relacionados
  levam à página do serviço.

## Dados estruturados em uso

| Página             | Nós                                                               |
| ------------------ | ----------------------------------------------------------------- |
| Todas (layout)     | `WebSite` (`/#website`), `Person` (`/#person`)                    |
| `/sobre`           | `ProfilePage` (entidade principal: `/#person`), `BreadcrumbList`  |
| Demais internas    | `BreadcrumbList`                                                  |
| `/servicos/<slug>` | `Service` (prestador: `/#person`, área: Brasil), `BreadcrumbList` |
| `/blog/<slug>`     | `BlogPosting` (autor e editor: `/#person`), `BreadcrumbList`      |

Builders em `lib/seo/structured-data.ts`, componentes em `components/atoms/json-ld.tsx` e `components/molecules/page-json-ld.tsx`.

## Redirects

Rotas do portfólio antigo com 308 (`next.config.ts`):

| Antiga                           | Nova           |
| -------------------------------- | -------------- |
| `/experiences`, `/experiences/*` | `/experiencia` |
| `/projects`, `/projects/*`       | `/projetos`    |
| `/contact`                       | `/contato`     |

## Checklist de lançamento

Quando o domínio apontar para o site novo:

- [ ] **Search Console, propriedade de domínio:** verificar por registro TXT no
      DNS da Cloudflare. A verificação por meta tag do portfólio antigo não
      existe no site novo.
- [ ] Enviar `https://elvisea.dev/sitemap.xml` no Search Console.
- [ ] **Bing Webmaster Tools:** importar a propriedade do Search Console.
- [ ] Inspecionar a URL da home e pedir indexação.
- [ ] Rich Results Test em `/`, `/sobre`, numa página de serviço e no primeiro
      post.
- [ ] `curl -I` nas rotas antigas: todas com 308.
- [ ] `/blog` com `noindex` enquanto não houver post.
- [ ] Lighthouse (SEO e acessibilidade) nas páginas principais.
- [ ] LinkedIn, GitHub e YouTube com link para `https://elvisea.dev` (o `sameAs`
      funciona melhor quando o perfil também aponta para o site).
- [ ] Depois de duas a quatro semanas: conferir as páginas indexadas e as
      primeiras consultas no Search Console e revisar este mapa.

## Acompanhamento

- Consultas por página no Search Console: se uma página aparece para um termo
  que não é o dela, ajustar título, H1 ou descrição da página certa.
- Revisar o mapa a cada trimestre ou quando um serviço mudar.
- Termos que trazem visita sem contato entram na lista de negativos.
