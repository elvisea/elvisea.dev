# AGENTS.md — instruções para agentes de código

Fonte única de contexto para qualquer agente (Claude Code, Cursor, Codex…).
`CLAUDE.md` e `.cursor/rules/agents-canonical.mdc` apenas referenciam este arquivo.

## Projeto

- **O que é:** site pessoal de **Elvis Erison Amancio** (`elvisea.dev`). Extensão
  do currículo e do LinkedIn: experiência, projetos, blog e contato.
- **Público:** recrutadores, gestores técnicos e empresas (majoritariamente não
  desenvolvedores). Idioma: **somente PT-BR**.
- **Repositório público.** Nada de segredo, dado pessoal sensível ou informação
  interna de empregador em código, conteúdo, commit ou issue.

## Regras de conteúdo (obrigatórias)

1. **Sem frases de efeito, slogans ou promessas.** Hero, títulos, bio e textos
   de perfil trazem cargo, stack e fatos verificáveis. Se uma frase de
   posicionamento parecer útil, proponha como opção e espere a decisão; nunca
   aplique por conta própria.
2. **Não publicar:** telefone, salário/pretensão, vitórias em licitações,
   topologia de infraestrutura de empregador.
3. **Trio:** aparece sem link para a página da empresa.
4. **Texto canônico** das experiências e do "Sobre" nasce no repositório local
   `~/projects/presenca-digital/perfil/` (mesmo texto publicado no LinkedIn) e
   chega ao site por cópia revisada. Não reescrever fatos por conta própria.
5. **Não inventar números** (clientes, usuários, percentuais). Todo fato precisa
   de fonte.
6. Tom: profissional, direto e técnico, sem jargão de marketing.

## Stack

- **Runtime e pacotes:** Bun (`bun install`, `bun run …`). Versão em
  `.bun-version` (a mesma no `Dockerfile` e na CI). Não usar npm/yarn/pnpm.
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 6 estrito.
  TypeScript 7 fica para quando o typescript-eslint (usado pelo
  `eslint-config-next`) suportá-lo.
- **Lint:** ESLint 10 (flat config). `settings.react.version` é explícito no
  `eslint.config.mjs` porque o eslint-plugin-react 7 não detecta a versão no
  ESLint 10; atualizar junto com o React.
- **Estilo:** Tailwind CSS 4 (configuração só em `app/globals.css`).
- **Componentes:** shadcn/ui estilo `base-nova` sobre `@base-ui/react` (usa a
  prop `render`, não `asChild`). Ícones: `lucide-react`.
- **Validação:** zod 4 para dados externos (frontmatter, APIs, formulários).
- **Testes:** `bun:test` (`bun test`), com `test-setup.ts` pré-carregado.

## Arquitetura

- **Tudo estático no build.** Nenhuma leitura de filesystem em runtime; conteúdo
  entra por `import` (TS/JSON) ou é lido em build (Markdown). Assim o site roda
  igual em Docker standalone ou em Cloudflare Workers.
- **Única parte em runtime:** a Server Action do formulário de contato
  (`app/actions/contact`). O envio de e-mail é plugável (`lib/email/sender.ts`,
  `EMAIL_TRANSPORT`), para trocar SMTP por API HTTP se a hospedagem exigir.
  Não há confirmação por e-mail ao visitante (evita abuso do formulário).
- **Não ligar `cacheComponents`** do Next 16: as rotas usam `dynamic =
"force-static"` e `dynamicParams = false`, que ele proíbe.
- `content/pt-BR/` guarda conteúdo e textos de interface (`site.ts`, `pages/*`,
  `blog/posts/*.md`). Componentes não têm texto fixo.
- Header e rodapé ficam em `app/layout.tsx`; páginas renderizam só o conteúdo.
- URL do site é a constante `site.url` (`content/pt-BR/site.ts`), usada em
  metadata, sitemap, robots e imagens OG.
- Imagens OG com `next/og` usam as TTF de `assets/fonts` (satori não lê woff2).

## Estilo visual

Paleta derivada do banner do LinkedIn, com contraste AA medido (detalhes e
valores em `app/globals.css`):

| Token        | Claro     | Escuro    | Uso                       |
| ------------ | --------- | --------- | ------------------------- |
| `background` | `#F8FAFC` | `#0A0F1C` | fundo                     |
| `heading`    | `#0A0F1C` | `#F8FAFC` | títulos                   |
| `primary`    | `#0F766E` | `#2DD4BF` | links, CTAs, foco         |
| `highlight`  | `#4F46E5` | `#818CF8` | eyebrows e detalhes       |
| `surface`    | `#F1F5F9` | `#0D1424` | seções alternadas, rodapé |

- Teal claro e indigo-500 sobre fundo claro só como decoração (contraste baixo).
- Geist e Geist Mono; mono para rótulos curtos (eyebrow, domínio, stack).
- Áreas clicáveis de pelo menos ~44 px em mobile. Tema claro e escuro sempre.

## Componentização — design atômico

| Camada         | Papel                            | Exemplos                                          |
| -------------- | -------------------------------- | ------------------------------------------------- |
| **Átomos**     | Blocos mínimos                   | `components/ui/*` (shadcn) e `components/atoms/*` |
| **Moléculas**  | Combinações simples de átomos    | `PostCard`, `PostMeta`, `ThemeToggle`             |
| **Organismos** | Seções completas                 | `SiteHeader`, `HeroSection`, `BlogList`           |
| **Páginas**    | Rota + dados (`app/**/page.tsx`) | Home, `/blog`, `/blog/[slug]`                     |

- Busca de dados e efeitos ficam em páginas e organismos, nunca em átomos.
- TypeScript estrito, sem `any`. Responsivo do mobile ao desktop.

## Fluxo de trabalho

Comandos canônicos em [.claude/commands/](.claude/commands/): `branch`,
`commit`, `review`, `pr`, `merge` e `fluxo-completo` (encadeia os anteriores).
Revisor: [.claude/agents/code-reviewer.md](.claude/agents/code-reviewer.md).
No Cursor, [.cursor/commands/](.cursor/commands/) e
[.cursor/agents/](.cursor/agents/) só apontam para esses arquivos.

- Issue antes da branch; branch `tipo/<número>` a partir da `develop`.
- Conventional Commits (semantic-release na `main`).
- PR para `develop`; merge da `develop` na `main` gera release e imagem no GHCR.
- Antes do PR: `bun run lint`, `bun run format:check`, `bun run typecheck`,
  `bun test` e `bun --bun run build`.
