# AGENTS.md — instruções para agentes de código

Fonte única de contexto para qualquer agente (Claude Code, Cursor, Codex…).
`CLAUDE.md` e `.cursor/rules/agents-canonical.mdc` apenas referenciam este arquivo.

## Projeto

- **O que é:** site pessoal de **Elvis Erison Amancio** (`elvisea.dev`). Extensão
  do currículo e do LinkedIn: experiência, projetos, blog e contato.
- **Públicos, em ordem de prioridade** (a maioria não é desenvolvedor):
  1. **Contratação:** recrutadores, RH, CEOs, CTOs e contratantes.
  2. **Empresas que buscam serviços no Google** (chatbot com IA, automação,
     sistemas, aplicativos…).
  3. **Técnicos e desenvolvedores**, em geral vindos do LinkedIn.

  Quando uma decisão de página favorece um público em detrimento de outro, vale
  a ordem acima.

- **Idioma:** somente PT-BR.
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

## SEO

Mapa de termos, modelo de página e checklist de lançamento em
[docs/SEO.md](docs/SEO.md).

1. **Uma intenção de busca por página.** Título final (com o sufixo
   ` · Elvis Amancio`) com até 60 caracteres e `metaDescription` entre 70 e
   160, ambos sobre essa intenção. Acima disso o Google corta; muito curta, ele
   troca por um trecho da página. `lib/content/content.test.ts` confere.
2. **Um H1 por página, descritivo:** diz o que a página é (cargo, serviço,
   assunto). Nada de slogan, que também é regra de conteúdo.
3. **Sem meta `keywords`** (o Google ignora) e **sem páginas por cidade ou
   estado** (conteúdo repetido é tratado como spam). A localização aparece uma
   vez: Curitiba, com atendimento remoto em todo o Brasil.
4. **Metadata sempre por `pageMetadata`** (`lib/seo/metadata.ts`).
5. **Dados estruturados em `lib/seo/structured-data.ts`**, como funções puras
   e testadas.
   - `WebSite` e `Person` vão no layout, com `@id`.
   - Cada página acrescenta os próprios nós com `PageJsonLd`, que referenciam a
     pessoa pelo `@id`.
   - Toda rota interna tem `BreadcrumbList`.
6. **Página sem conteúdo não indexa:** `noindex` e fora do sitemap, voltando
   sozinha quando o conteúdo chega (ex.: `/blog` sem posts).
7. **Todo conteúdo novo** (post, estudo de caso) leva a uma página relacionada
   do site: experiência, projeto ou contato.
8. **Rota renomeada ganha redirect 308** em `next.config.ts`. Redirects não são
   removidos.

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
- **Release:** semantic-release com preset `conventionalcommits` na linha 9.x.
  A 10 exige `conventional-changelog-writer` 9, que o
  `@semantic-release/release-notes-generator` ainda não usa. Rodar
  `bunx semantic-release --dry-run --no-ci --branches develop` antes de subir.
- **Testes:** `bun:test` (`bun test`), com `test-setup.ts` pré-carregado.
- **Documentação do Next:** a versão instalada traz a documentação em
  `node_modules/next/dist/docs/`; consulte-a antes de usar uma API do Next.
  O bloco `nextjs-agent-rules` no fim deste arquivo é mantido pelo `next dev`
  (Next 16.3+) e fica versionado para a árvore continuar limpa; não edite
  dentro dele.

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

## Componentes de interface (regra canônica)

**Usar somente componentes do shadcn/ui no estilo Base UI** (`components.json`:
`base-nova`), instalados pela CLI (`bunx --bun shadcn@latest add <nome>`) em
`components/ui/`. Documentação: <https://ui.shadcn.com/docs/components/base>.

- Antes de criar qualquer elemento de interface, procurar o componente
  equivalente na documentação e instalá-lo. Não recriar com `div`/`span` e
  classes o que o shadcn já oferece.
- Mapeamento usado neste projeto:

  | Necessidade                   | Componente                                               |
  | ----------------------------- | -------------------------------------------------------- |
  | Botão                         | `Button`                                                 |
  | Link com aparência de botão   | `buttonVariants` num `<a>`/`Link` (ver abaixo)           |
  | Seleção de uma opção          | `Select` (nunca `native-select` ou `<select>`)           |
  | Campo de formulário           | `Field`, `FieldLabel`, `FieldError`, `Input`, `Textarea` |
  | Filtro com opções alternáveis | `ToggleGroup`                                            |
  | Caixa com conteúdo            | `Card` (`CardHeader`, `CardContent`, `CardFooter`)       |
  | Etiqueta, tag, chip           | `Badge`                                                  |
  | Mensagem de erro/sucesso      | `Alert`                                                  |
  | Lista de itens com ação       | `Item`, `ItemGroup`, `ItemSeparator`                     |
  | Estado vazio                  | `Empty`                                                  |
  | Linha divisória               | `Separator`                                              |
  | Menu lateral (mobile)         | `Sheet`                                                  |

- **Links com cara de botão:** `buttonVariants` num `<a>` ou `Link`. É a
  recomendação do shadcn para Base UI: `<Button render={<a />}>` força
  `role="button"` e apaga a semântica de link.
- Componentes gerados não são editados à mão; ajustes visuais vão por
  `className` no uso. Se for preciso mudar o componente, registrar o motivo.
- **Exceções aceitas** (com comentário no código): campos ocultos do
  anti-spam do formulário (inputs nativos), elementos decorativos sem
  equivalente (pontos da timeline) e bordas de layout entre regiões da página.

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

| Camada         | Papel                            | Exemplos                                                                                                               |
| -------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Átomos**     | Blocos mínimos                   | `components/ui/*` (shadcn, obrigatório quando existir) e `components/atoms/*` (só o que o shadcn não tem, ex.: ícones) |
| **Moléculas**  | Combinações simples de átomos    | `PostCard`, `PostMeta`, `ThemeToggle`                                                                                  |
| **Organismos** | Seções completas                 | `SiteHeader`, `HeroSection`, `BlogList`                                                                                |
| **Páginas**    | Rota + dados (`app/**/page.tsx`) | Home, `/blog`, `/blog/[slug]`                                                                                          |

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
