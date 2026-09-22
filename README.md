# elvisea.dev

Site pessoal de **Elvis Erison Amancio**, desenvolvedor full-stack: experiência
profissional, projetos, artigos e contato.

## Stack

- [Next.js 16](https://nextjs.org) (App Router), React 19 e TypeScript 6
- [Bun](https://bun.com) 1.4 como runtime e gerenciador de pacotes (versão em `.bun-version`)
- [Tailwind CSS 4](https://tailwindcss.com) e [shadcn/ui](https://ui.shadcn.com) sobre Base UI
- Blog em Markdown (remark/rehype), imagens OG com `next/og`
- Testes com `bun:test`; release com semantic-release; imagem Docker no GHCR

## Desenvolvimento

```bash
bun install
bun run dev          # http://localhost:3000
```

| Comando                | O que faz                      |
| ---------------------- | ------------------------------ |
| `bun run lint`         | ESLint                         |
| `bun run format:check` | Prettier (verificação)         |
| `bun run typecheck`    | Tipos do Next + `tsc --noEmit` |
| `bun test`             | Testes unitários               |
| `bun --bun run build`  | Build de produção (standalone) |
| `bun run docker:build` | Imagem Docker local            |

## Estrutura

```
app/            rotas finas (App Router): metadata, sitemap, robots, imagens OG
features/       uma pasta por área do site, em MVVM: repository, domain,
                view-model, view e componentes
components/     compartilhados: ui (shadcn), atoms, molecules, organisms e templates
content/pt-BR/  textos e dados do site; posts em blog/posts/*.md
lib/            utilitários transversais: seo, markdown, datas, log, e-mail
assets/fonts/   fontes TTF usadas nas imagens OG (SIL OFL)
```

Arquitetura (MVVM por feature, design atômico e responsabilidade única) em
[`AGENTS.md`](AGENTS.md).

O conteúdo é gerado em build: o site é estático e roda como container
standalone ou em qualquer plataforma que sirva Next.js.

## Fluxo

Issue → branch `tipo/<número>` a partir da `develop` → PR para `develop` →
merge na `main` gera a release (semantic-release) e a imagem
`ghcr.io/elvisea/elvisea.dev`. Detalhes para agentes de código em
[`AGENTS.md`](AGENTS.md).

Como escrever e divulgar posts: [`docs/BLOG.md`](docs/BLOG.md).

## Onde roda

<https://elvisea.dev> roda na stack do meu homelab, em container, atrás do
nginx-proxy-manager e exposto por Cloudflare Tunnel — sem nenhuma porta aberta
no roteador. Infra em [elvisea/homelab](https://github.com/elvisea/homelab).

O build fica no GitHub Actions: cada release publica
`ghcr.io/elvisea/elvisea.dev`, e o homelab só faz `pull` de uma tag exata.
Atualizar o site é trocar essa tag no compose de lá e rodar o deploy.

Este repositório é a fonte da verdade. O
[git.elvisea.dev](https://git.elvisea.dev/elvis/elvisea.dev) mantém um espelho
(pull mirror), como backup independente de plataforma.
