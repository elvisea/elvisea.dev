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
   do site: serviço, experiência, projeto ou contato.
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
- **Testes:** `bun:test` (`bun test`). Pré-carregados: `test-setup.ts` (mocks
  de servidor e DOM do happy-dom) e `test-dom.ts` (matchers do Testing
  Library).
  - Funções puras, repositories e view-models de servidor: `*.test.ts`, com a
    fonte de dados injetada (sem mock global de módulo).
  - Hook view-model: `renderHook` do Testing Library.
  - Views e componentes com estado ou lógica condicional: `*.render.test.tsx`,
    cobrindo os estados visíveis (vazio, erro, sucesso, filtro), com consultas
    por papel e nome acessível (`getByRole`).
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
  `blog/posts/*.md`). Componentes não têm texto fixo: recebem os textos por
  props.
- Header e rodapé ficam em `app/layout.tsx`; páginas renderizam só o conteúdo.
- **Cada área do site é uma feature em MVVM**, em `features/<feature>/`
  (`features/services` é o modelo):

  | Pasta                                     | Papel                                                                                                               |
  | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
  | `routes.ts`                               | caminhos e links da feature                                                                                         |
  | `repository/`                             | acesso a dados (conteúdo, Markdown, snapshot, envio), com tipos, fonte injetável e sem estado                       |
  | `<fluxo>/validations.ts`                  | schema zod do fluxo, quando há formulário                                                                           |
  | `<fluxo>/view-model/`                     | monta o que a tela mostra: `get-*-view-model.ts` (função pura, servidor) ou `use-*-view-model.ts` (hook de cliente) |
  | `<fluxo>/view/`                           | só renderiza o `model` recebido por prop                                                                            |
  | `components/{atoms,molecules,organisms}/` | componentes da feature                                                                                              |

  As áreas que ainda não estão em `features/` migram pelas sub-issues de #24
  (#45 a #50).

- **Rota fina:** `app/**/page.tsx` declara a metadata
  (`pageMetadata(model.metadata)`) e o `generateStaticParams` e renderiza
  `<XView model={getXViewModel()} />`. Sem layout, busca de dados ou lógica.
- **Direção das dependências:** `app/` → `features/` → `components/` → `lib/`,
  nunca ao contrário.
  - `lib/` só tem utilitários puros e transversais (SEO, Markdown, datas, log,
    e-mail genérico) e nunca importa `app/`, `features/` nem `components/`.
  - Uma feature importa de outra só `repository/`, `routes.ts` e
    `components/` (a home agrega as outras); nunca `view/` nem `view-model/`.
  - O `eslint.config.mjs` confere as fronteiras com `no-restricted-imports`.
- **Responsabilidade única:** um arquivo, uma responsabilidade, com o teste ao
  lado.
  - Server Action e route handler são finos: leem a entrada e delegam.
  - Regra de negócio fica em função pura.
  - Serviço recebe as dependências por parâmetro (relógio, headers, transporte
    de e-mail, `fetch`, fonte de dados), para o teste não depender de rede,
    filesystem ou relógio reais.
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

| Camada         | Papel                                          | Onde                                                                                                                             |
| -------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Átomos**     | Blocos mínimos                                 | `components/ui/*` (shadcn, obrigatório quando existir) e `components/atoms/*` (só o que o shadcn não tem: ícone, link com seta…) |
| **Moléculas**  | Combinações simples de átomos                  | `components/molecules/*` e `features/<f>/components/molecules/*`                                                                 |
| **Organismos** | Seções completas                               | `components/organisms/*` e `features/<f>/components/organisms/*`                                                                 |
| **Templates**  | Cascos de página e de seção, sem dados reais   | `components/templates/*` (`PageTemplate`, `SectionTemplate`, `OgCardTemplate`)                                                   |
| **Views**      | Compõem template e organismos com o view-model | `features/<f>/<fluxo>/view/*`, renderizadas pela rota                                                                            |

- Dependência só para baixo: view → template → organismo → molécula → átomo.
- Átomos e moléculas recebem tudo por props: nunca importam `content/`,
  repository, consulta de dados de `lib/` ou organismo.
- Organismos recebem os dados por props e podem ter estado de interface; a
  lógica fica no hook view-model ou em funções puras.
- Componente usado por mais de uma feature fica em `components/`; o de uma
  feature só, em `features/<f>/components/`.
- Um componente exportado por arquivo.
- Padrão visual repetido vira átomo ou molécula (`ArrowLink`, `Eyebrow`,
  `MonoLabel`, `CtaCard`), nunca classe copiada.
- TypeScript estrito, sem `any`. Responsivo do mobile ao desktop.

## Fluxo de trabalho

Os roteiros ficam versionados no repositório e valem para qualquer agente. No
Claude Code, comandos e skills viram `/nome`; no Cursor,
[.cursor/commands/](.cursor/commands/) e [.cursor/agents/](.cursor/agents/)
só apontam para os arquivos abaixo.

**Comandos** ([.claude/commands/](.claude/commands/)): passos do fluxo,
chamados por quem está trabalhando.

| Comando            | Para quê                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `branch`           | issue (se faltar) e branch `tipo/<número>` a partir da `develop`         |
| `worktree`         | pasta de trabalho paralela para uma issue (outra tarefa ou outro agente) |
| `commit`           | validação local e commits em Conventional Commits                        |
| `review`           | checklist de revisão do diff (o mesmo do agente `code-reviewer`)         |
| `pr`               | pull request para a `develop` com resumo, verificação e `Closes #N`      |
| `merge`            | merge, limpeza de branch e worktree, fechamento da issue, PR de release  |
| `complete-flow`    | encadeia todos os passos acima                                           |
| `scaffold-feature` | esqueleto de feature MVVM a partir de `features/services`                |

**Skills** ([.claude/skills/](.claude/skills/)): tarefas que o agente também
aciona sozinho quando o contexto pede.

| Skill           | Para quê                                                                   |
| --------------- | -------------------------------------------------------------------------- |
| `pr-checks`     | acompanhar a CI do PR até verde, corrigindo falhas da branch               |
| `smoke-test`    | rotas nos dois temas, em 400 e 1280 px, com screenshots e erros de console |
| `page-errors`   | diagnóstico de erro de console, rede e servidor numa página                |
| `perf-audit`    | trace de performance e Core Web Vitals no build de produção                |
| `seo-audit`     | metadata, JSON-LD, sitemap, redirects, termos proibidos e Lighthouse       |
| `release-check` | verificação completa da `develop` antes do merge de release                |

**Revisor:** [.claude/agents/code-reviewer.md](.claude/agents/code-reviewer.md),
rodado antes de todo PR.

### Regras

- Issue antes da branch; branch `tipo/<número>` a partir da `develop`.
- Conventional Commits (semantic-release na `main`).
- Antes do PR: `bun run lint`, `bun run format:check`, `bun run typecheck`,
  `bun test` e `bun --bun run build`; mudança visual ou de rota passa pelas
  skills `smoke-test` e `seo-audit`.
- PR para `develop`; mesclado quando a CI passa. O PR de release
  (`develop` → `main`) só é mesclado com OK explícito do dono e gera tag,
  changelog, release e imagem no GHCR.
- Depois da release, um PR `main` → `develop` traz o commit
  `chore(release)`. Como ele tem `[skip ci]`, a validação desse PR é local.
  PRs de release e de sincronização nunca usam `--delete-branch`.
- A branch padrão do GitHub é `main`, então o `Closes #N` de um PR para
  `develop` não fecha a issue sozinho. O `merge` fecha a issue como concluída
  logo depois do merge, para que as issues abertas sejam só as pendentes. O PR
  de release repete os `Closes` do ciclo para rastreabilidade.
- Mudanças só em `.claude/**`, `.cursor/**`, `AGENTS.md` ou `CLAUDE.md` não
  disparam a CI.

### Worktrees

Detalhes e comandos em [.claude/commands/worktree.md](.claude/commands/worktree.md).

- **Trabalho que vira PR:** worktree **irmã** do repositório
  (`../elvisea.dev-<número>`), criada com `git worktree add` a partir de
  `origin/develop`.
- **Isolamento do Claude Code** (`claude --worktree`, `EnterWorktree`,
  subagentes com `isolation: worktree`):
  - fica em `.claude/worktrees/`, ignorado pelo git e pelo ESLint;
  - `worktree.baseRef: "head"` no `.claude/settings.json` faz a worktree partir
    do `HEAD` atual e não da `main`;
  - `.worktreeinclude` copia `.env` e `.env.local`.
- **Dependências:** `bun install --frozen-lockfile` em cada worktree. **Nunca**
  `node_modules` por symlink: o Turbopack do Next 16 recusa symlink que aponta
  para fora do projeto.
- **Dev server:** cada worktree em outra porta (`bun run dev --port 3001`); o
  Next 16 recusa dois dev servers na mesma pasta.
- **Isolamento:** um agente ou uma tarefa por worktree. Depois do merge,
  `git worktree remove` e `git branch -d`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
