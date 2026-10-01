# Checklist de review — elvisea.dev

Usado por `/flow:review` e pelo agente `code-reviewer` (plugin `flow`), junto
com o `AGENTS.md` e o checklist genérico do harness. Em dúvida, o `AGENTS.md`
vale. Mantenha este arquivo alinhado ao `AGENTS.md` ao mudar um padrão.

Site pessoal em **repositório público**: tudo o que entra no diff (código,
texto, mensagem de commit, issue e PR) fica público.

## Áreas por risco (da maior para a menor)

1. `features/contact/repository/` (Server Action: entrada do usuário, e-mail,
   logs)
2. `content/pt-BR/` e textos públicos (regras de conteúdo)
3. `lib/`, `features/`, `app/**/page.tsx` e metadata
4. `components/`, estilos
5. Docker, CI, dependências
6. Documentação

Para fatos de conteúdo, confira a fonte citada (`experiencias.ts`,
`~/projects/presenca-digital/perfil/` ou o código do projeto mencionado) antes
de marcar "fato sem fonte".

## Checklist

### Repositório público e conteúdo (AGENTS.md § Regras de conteúdo)

- **Crítico:**
  - frase de efeito, slogan ou promessa em texto público;
  - telefone fora de `site.contact.whatsapp`, salário/pretensão ou licitação;
  - detalhe interno de empregador (topologia, repositórios, clientes, rotas
    internas);
  - link para a página da Trio;
  - nome ou link de projeto de nicho sensível (só a capacidade, sem nome);
  - segredo ou `.env` versionado.
- **Aviso:**
  - fato sem fonte (`presenca-digital`, `experiencias.ts`, código conferido);
  - número inventado;
  - preço, prazo ou garantia em página de serviço;
  - integração de WhatsApp sem dizer que não usa a API oficial.
- Texto de interface fica em `content/pt-BR/`, nunca fixo em componente.

### SEO (AGENTS.md § SEO)

- Metadata sempre por `pageMetadata` (`lib/seo/metadata.ts`): `openGraph` e
  `alternates` escritos à mão na página apagam os do layout.
- Título final (com ` · Elvis Amancio`) com até 60 caracteres; descrição entre
  70 e 160. Página nova entra nos testes de conteúdo que conferem isso.
- Um `h1` por página, descritivo; ordem de títulos sem saltos.
- Rota interna nova com `PageJsonLd` (trilha) e nós de
  `lib/seo/structured-data.ts`. Nada de JSON-LD montado à mão.
- Sem meta `keywords` e sem página por cidade.
- Página sem conteúdo com `noindex` e fora do sitemap; rota nova entra no
  `app/sitemap.ts`.
- Rota renomeada ou removida ganha redirect 308 em `next.config.ts`.

### Componentes (AGENTS.md § Componentes de interface)

- **Crítico:** elemento recriado à mão quando existe componente shadcn (Base UI)
  equivalente. Exemplos:
  - `<select>`/`native-select` em vez de `Select`;
  - `<button>` em vez de `Button`/`ToggleGroup`;
  - `div` com borda em vez de `Card`;
  - chip manual em vez de `Badge`;
  - caixa de erro manual em vez de `Alert`;
  - lista expansível manual em vez de `Accordion`.
- Componente que falta entra pela CLI (`bunx --bun shadcn@latest add <nome>`);
  `components/ui/` não é editado à mão.
- Link com aparência de botão usa `buttonVariants` em `<a>`/`Link`, nunca
  `<Button render={<a />}>` (o Base UI força `role="button"`).
- Preset Base UI: prop `render`, sem `asChild` de exemplos Radix.
- Cores só por token (`primary`, `highlight`, `surface`, `heading`…); nada de
  paleta Tailwind crua (`bg-sky-500`) nem cor fixa em `style`.

### Arquitetura: MVVM, design atômico e SRP (AGENTS.md § Arquitetura e § Componentização)

Modelo: `features/services`. O lint (`no-restricted-imports`) já barra parte
destes itens; o review cobre o que ele não enxerga.

- **Aviso:** área do site fora de `features/<feature>/`:
  - `repository/`: acesso a dados, com tipos, fonte injetável e sem estado;
  - `domain/`: funções puras que outra feature reaproveita (mapeadores de
    card, regras);
  - `<fluxo>/validations.ts`: schema zod do fluxo, quando há formulário;
  - `<fluxo>/view-model/`: função pura (`get-*-view-model.ts`) ou hook de
    cliente (`use-*-view-model.ts`), com teste;
  - `<fluxo>/view/`: só renderiza o `model`, sem ler conteúdo nem montar link;
  - `components/{atoms,molecules,organisms}/`.
- `app/**/page.tsx` só declara metadata e `generateStaticParams` e renderiza
  a View. Layout, busca de dados ou lógica na rota é aviso.
- **Direção das dependências:** `app/` → `features/` → `components/` → `lib/`.
  - `lib/` importando `app/`, `features/` ou `components/` é aviso.
  - Feature importando `view/` ou `view-model/` de outra é aviso (só
    `repository/`, `domain/`, `routes.ts` e `components/`).
- **Design atômico:**
  - dependência só para baixo: view → template → organismo → molécula → átomo;
  - átomo ou molécula lendo `content/`, repository ou consulta de dados de
    `lib/`, ou importando organismo, é aviso;
  - organismo buscando os próprios dados em vez de recebê-los por props;
  - casco de página ou seção copiado em vez de `PageTemplate` ou
    `SectionTemplate`;
  - padrão visual repetido (link com seta, eyebrow, rótulo mono, card de
    chamada) copiado em vez de usar `ArrowLink`, `Eyebrow`, `MonoLabel` ou
    `CtaCard`;
  - mais de um componente exportado no mesmo arquivo.
- **Responsabilidade única:**
  - Server Action e route handler com regra de negócio própria (devem ler a
    entrada e delegar);
  - serviço que lê `process.env`, `Date.now()`, `fetch` ou filesystem direto
    em vez de receber por parâmetro;
  - efeito colateral no import de módulo (validação, leitura de arquivo).
- **Estado na URL** (`useSearchParams`):
  - parser puro e testado, como `features/contact/form/prefill.ts`, que ignora
    valores desconhecidos;
  - o componente fica dentro de `Suspense` para a página seguir estática.

### Next.js 16 (App Router, tudo estático)

- Rotas dinâmicas com `dynamic = "force-static"`, `dynamicParams = false` e
  `generateStaticParams`. Sem `cacheComponents`, sem leitura de filesystem em
  runtime e sem `force-dynamic`.
- Arquivo lido em build (Markdown) entra em `outputFileTracingIncludes`.
- Imagens com `next/image` (exceto SVG inline e ícones).

### Server Action, e-mail e logs (`features/contact/repository`)

- A action (`submit-contact-action.ts`) só lê a requisição e chama
  `processContactSubmission`; regra nova entra numa função pura testada.
- Ordem dos sinais de robô: isca antes da validação, tempo mínimo depois dela
  (envio inválido sempre mostra os erros); os dois mantidos.
- Rate limit por IP com o header confiável (`TRUSTED_IP_HEADER`).
- Constante ou tipo exportado de arquivo `"use server"` quebra o build: vai
  para `types.ts` ou para `form/`.
- Logs só pelo `logger` (`lib/log/logger.ts`), com evento nomeado:
  - sem nome, texto da mensagem, e-mail completo ou IP completo (`maskEmail`,
    `ipPrefix`);
  - nunca `console.log` solto em código de servidor.
- HTML de e-mail com escape de todo valor digitado.

### Acessibilidade

- Nome acessível contém o texto visível: complemento em `sr-only` depois do
  texto, não `aria-label` que o substitui.
- Ícone decorativo com `aria-hidden`; link externo com
  `rel="noopener noreferrer"`.
- Alvos de toque com pelo menos ~44 px (`min-h-11`/`h-11`).
- Formulário com `FieldLabel`, `FieldError` e `aria-invalid`.

### Mobile first e temas

- Classes base descrevem o mobile; `sm:`/`md:`/`lg:` só acrescentam.
- Sem largura fixa que gere rolagem horizontal em 400 px.
- Tema claro e escuro conferidos quando houver mudança visual (`qa:smoke`).

### Testes (`bun test`)

- Regra nova em `lib/**`, `features/**/view-model`, `features/**/repository`,
  `features/**/domain` ou `features/**/form` vem com teste ao lado, com
  dependências injetadas em vez de módulos reais.
- Conteúdo novo com invariantes (slugs, limites de SEO, termos proibidos) no
  teste do conteúdo.
- Hook view-model testado com `renderHook`.
- View e componente com estado ou lógica condicional vêm com
  `*.render.test.tsx` cobrindo os estados visíveis (vazio, erro, sucesso,
  filtro), com consultas por papel e nome acessível.
- Teste com mock global de módulo (`mock.module`) onde uma dependência
  injetada resolveria é aviso.

### Dependências novas (diff toca `package.json` ou `bun.lock`)

Além do checklist genérico (necessidade, versão estável, licença, `pm audit`):

- Componente de interface vem do shadcn, não de outra biblioteca.
- Pin em versão antiga só com o motivo registrado (como TypeScript 6 e o
  preset `conventionalcommits` 9.x no `AGENTS.md`).
- **Binário nativo** (`.node`, `.so`, pacotes opcionais por plataforma):
  - existe variante **musl**? A imagem é `oven/bun` Alpine;
  - o `output: "standalone"` rastreia a dependência, ou é preciso
    `serverExternalPackages` ou `COPY` no `Dockerfile`;
  - validar com `docker build` e o container rodando, não só na máquina local.
- **Peso** no bundle do cliente e na imagem. Dependência de servidor importada
  só em código de servidor (`server-only`).
- Projeto mantido; `bun run security:check` sem alta ou crítica.
- **Lockfile:** `bun.lock` atualizado pelo Bun (nunca npm, yarn ou pnpm).

### Docker e CI (quando o diff tocar infra)

- `Dockerfile` multi-stage compatível com `output: "standalone"`; versão do Bun
  igual ao `.bun-version`.
- Actions fixadas por SHA (com a tag no comentário); jobs de segurança
  (`bun audit`, Trivy) e qualidade (lint, formatação, tipos, testes, build)
  coerentes com `package.json`.
- Diagnóstico temporário de workflow nunca entra em PR para `develop`: usar
  `ACTIONS_STEP_DEBUG` ou uma branch descartável.

### Commits e release

- Tipo coerente com a branch (`feat/12` → `feat`). O semantic-release gera
  versão e changelog a partir deles (tabela em `.harness/scopes.md`).
- `feat!:` ou `BREAKING CHANGE:` só para quebra real.
- Mensagem sem dado sensível (o histórico é público).

## Gotchas

| Tema                | Observação                                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repositório público | Diff, commits, issues e PRs são públicos. Dado pessoal, detalhe interno de empregador, nicho sensível com nome ou segredo é **Crítico**.                                                                                                                                                                          |
| Regras de conteúdo  | Sem frase de efeito, telefone fora de `site.contact.whatsapp`, salário, licitação, número inventado, preço/prazo/garantia em serviço. Trio sem link.                                                                                                                                                              |
| Bun                 | Scripts com `bun run …`/`bun --bun …`; lockfile `bun.lock`. Não sugerir npm/yarn/pnpm.                                                                                                                                                                                                                            |
| Next 16 estático    | `force-static` + `dynamicParams = false`; sem `cacheComponents`. Documentação da versão em `node_modules/next/dist/docs/`. `useSearchParams` só dentro de `Suspense`.                                                                                                                                             |
| Metadata e JSON-LD  | `pageMetadata` (a página substitui `openGraph`/`alternates` do layout); JSON-LD só pelos builders de `lib/seo/structured-data.ts` e `PageJsonLd`. Limites de título/descrição testados.                                                                                                                           |
| shadcn Base UI      | Só componentes shadcn; recriar à mão é **Crítico**. Prop `render`, sem `asChild`. Link com cara de botão = `buttonVariants`.                                                                                                                                                                                      |
| MVVM e atômico      | Área do site em `features/<feature>/` (modelo: `features/services`); rota fina; View só renderiza o `model`; view-model e repository testados; `lib/` nunca importa `app/`, `features/` nem `components/`; átomo e molécula só com props; cascos por `PageTemplate`/`SectionTemplate`; um componente por arquivo. |
| Logs                | Só `logger` com evento nomeado; e-mail e IP mascarados; nunca nome ou texto da mensagem.                                                                                                                                                                                                                          |
| Docker standalone   | Imagem Alpine: dependência nativa precisa de variante musl e rastreio no standalone; healthcheck com `127.0.0.1`.                                                                                                                                                                                                 |
| Worktrees           | `node_modules` por symlink quebra o Turbopack (`worktree.deps: "install"`); cada worktree roda `bun install`. `.claude/worktrees/` é ignorado por git e ESLint.                                                                                                                                                   |
| Versões fixadas     | TypeScript 6 (typescript-eslint sem TS 7), `conventional-changelog-conventionalcommits` 9.x (a 10 quebra o release-notes-generator), `settings.react.version` explícito no ESLint 10. Os dois primeiros estão em `deps.ignoreMajors`.                                                                             |
| Release             | Branch padrão é `main`: `Closes #N` em PR para `develop` não fecha a issue sozinho (o `/flow:merge` fecha), mas continua obrigatório na descrição. Mensagens fora de Conventional Commits são aviso de processo.                                                                                                  |
| Secrets             | Nenhuma variável não pública como literal, em exemplo ou em log.                                                                                                                                                                                                                                                  |
