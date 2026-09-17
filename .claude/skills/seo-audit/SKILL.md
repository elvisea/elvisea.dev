---
name: seo-audit
description: Verifica SEO e acessibilidade do elvisea.dev no build de produção — Lighthouse (SEO, acessibilidade, boas práticas), título e descrição, H1, canonical, robots, JSON-LD (WebSite, Person, BreadcrumbList, Service, ProfilePage, BlogPosting), sitemap, redirects 308 e termos proibidos no HTML. Use antes de PR que cria ou muda rota, metadata ou conteúdo público, ou quando pedirem para "auditar SEO".
argument-hint: "[rotas, padrão as alteradas + / + /sobre + /servicos]"
---

# Auditoria de SEO e acessibilidade

Regras de referência: `AGENTS.md` § SEO e `docs/SEO.md`.

## Alvo

Build de produção em `http://127.0.0.1:3102` (ver skill `smoke-test` para subir
o standalone). Encerrar o servidor no fim.

## Passos

1. **HTML de cada rota** (`curl -s`), conferindo:
   - `<title>` com até 60 caracteres, `meta description` entre 70 e 160;
   - exatamente um `<h1>`;
   - `link rel="canonical"` com o caminho da própria rota;
   - `meta name="robots"`: `index, follow`, ou `noindex` só onde a regra manda
     (blog sem posts).
2. **JSON-LD:** extrair os `<script type="application/ld+json">` e validar com
   `jq`:

   ```bash
   curl -s "$B$ROTA" | grep -o '<script type="application/ld+json">[^<]*</script>' \
     | sed 's/<script[^>]*>//; s/<\/script>//' | jq '."@graph"[] | {"@type", "@id"}'
   ```

   Esperado:

   | Rota               | Nós                                    |
   | ------------------ | -------------------------------------- |
   | Todas              | `WebSite` e `Person`                   |
   | Internas           | `BreadcrumbList` começando em "Início" |
   | `/sobre`           | `ProfilePage`                          |
   | `/servicos/<slug>` | `Service`, com `provider` = `/#person` |
   | `/blog/<slug>`     | `BlogPosting`, com autor por `@id`     |

3. **Sitemap e robots:**
   - `/sitemap.xml` com todas as rotas indexáveis, sem as que têm `noindex`;
   - `/robots.txt` apontando para o sitemap.
4. **Redirects:** `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"` em
   `/experiences`, `/experiences/x`, `/projects`, `/projects/x` e `/contact`. Todos
   devem dar 308 para a rota nova.
5. **Termos proibidos** no HTML gerado:

   ```bash
   find .next/server/app -name '*.html' -print0 | xargs -0 grep -oiE \
     "viki|stayclose|lottopar|aerobi|probitech|licita[çc]|sal[aá]rio" | sort | uniq -c
   ```

   "solicitações" contém "licitaç": conferir o contexto antes de reportar.

6. **Lighthouse:** `lighthouse_audit` em mobile e desktop nas rotas do alvo. Meta:
   100 em SEO e acessibilidade. Para cada auditoria abaixo de 1, ler o
   `report.json`:

   ```bash
   jq -r '.audits | to_entries[] | select(.value.score != null and .value.score < 1)
     | "\(.key): \(.value.title)"' report.json
   ```

## Relatório

Tabela por rota: título (tamanho) | descrição (tamanho) | h1 | canonical |
robots | JSON-LD | Lighthouse SEO/A11y. Depois: sitemap, redirects e termos
proibidos. Cada falha com arquivo e correção sugerida.
