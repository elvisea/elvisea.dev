---
description: Gera o esqueleto de uma feature no padrão MVVM + design atômico (repository, view-model, view, componentes, rota fina e testes), usando features/services como modelo.
argument-hint: "<feature> [fluxos, ex.: catalog detail]"
---

# Scaffold de feature (MVVM + atômico)

Cria o esqueleto de uma feature seguindo o padrão do `AGENTS.md` § Arquitetura.
**Modelo de referência:** `features/services` (catálogo + detalhe), com testes.
Abra os arquivos dele antes de gerar e replique a forma, não o conteúdo.

## Quando usar

- Feature nova com dados próprios (lista, detalhe, formulário).
- Migração de uma área existente para MVVM (issues #22, #23 e #24).

## Quando não usar

- Página de texto sem dados: rota em `app/` com conteúdo em `content/pt-BR/`.
- Ajuste pequeno dentro de uma feature que já existe.

## Entradas

| Argumento      | Exemplo                                  |
| -------------- | ---------------------------------------- |
| `<feature>`    | `experience` (inglês, kebab-case)        |
| Fluxos         | `catalog`, `detail`, `form`              |
| Rota           | `/experiencia` (português, como no menu) |
| Fonte de dados | `content/pt-BR/experiencias.ts`          |

## Estrutura gerada

```
features/<feature>/
  routes.ts                                   caminhos da feature (sem strings de URL espalhadas)
  repository/
    types.ts                                  contrato do conteúdo
    <feature>-repository.ts                   createXRepository(source) + instância padrão
    <feature>-repository.test.ts              repository + invariantes do conteúdo
  <fluxo>/
    view-model/get-<feature>-<fluxo>-view-model.ts        função pura (servidor)
    view-model/get-<feature>-<fluxo>-view-model.test.ts   teste com repository falso
    view/<feature>-<fluxo>-view.tsx           só renderiza o model recebido
  components/
    molecules/                                combinações de átomos shadcn
    organisms/                                seções completas
app/<rota>/page.tsx                           metadata + <View model={getXViewModel()} />
```

Fluxo interativo no cliente: `view-model/use-<feature>-<fluxo>-view-model.ts`
(hook), com a lógica pura em funções testáveis ao lado. Estado lido da URL passa
por um parser puro, como `lib/contact/prefill.ts`.

## Convenções

- **Repository:** única porta para o conteúdo; recebe a fonte por parâmetro
  (`createXRepository(source)`) para os testes injetarem dados.
- **View-model:**
  - monta tudo o que a tela usa: textos de `content/pt-BR/pages/`, links via
    `routes.ts`, trilha, nós de JSON-LD e metadata;
  - sem JSX;
  - devolve `null` quando o item não existe (a rota chama `notFound()`).
- **View:** recebe `model` por prop; não importa conteúdo, repository nem monta
  link. Usa só componentes shadcn e os da feature.
- **Rota:**
  - `pageMetadata(model.metadata)`;
  - rotas dinâmicas com `dynamic = "force-static"`, `dynamicParams = false` e
    `generateStaticParams` a partir do repository.
- **SEO:** `PageJsonLd` na View; rota nova no `app/sitemap.ts`; título e
  descrição dentro dos limites testados.
- **Nomes:** pastas e arquivos em inglês kebab-case; textos da interface em
  português, sempre em `content/pt-BR/`.

## Workflow

1. Confirmar entradas com o usuário.
2. Ler `features/services` (repository, view-models, views, testes e rotas em
   `app/servicos`).
3. Criar na ordem: `types.ts` → repository + teste → `routes.ts` → view-model +
   teste → componentes → view → rota → sitemap.
4. Validar:

   ```bash
   bun run format:check && bun run lint && bun run typecheck && bun test && bun --bun run build
   ```

5. Commit via [`commit.md`](./commit.md), por exemplo
   `feat(<escopo>): estrutura MVVM de <feature>`.

## Regras

- ❌ Não inventar conteúdo para preencher o esqueleto: dados reais ou `TODO`
  explícito, nunca texto de exemplo publicado.
- ❌ Não colocar leitura de conteúdo na View nem JSX no view-model.
- ✅ Todo view-model e repository com teste antes do commit.
