# elvisea.dev

Site pessoal de **Elvis Erison Amancio**, desenvolvedor full-stack: experiência
profissional, projetos, artigos e contato.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) e React 19
- [Bun](https://bun.com) como runtime e gerenciador de pacotes
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
app/            rotas (App Router), metadata, sitemap, robots, imagens OG
components/     ui (shadcn), molecules e organisms
content/pt-BR/  textos e dados do site; posts em blog/posts/*.md
lib/            blog, og e utilitários
assets/fonts/   fontes TTF usadas nas imagens OG (SIL OFL)
```

O conteúdo é gerado em build: o site é estático e roda como container
standalone ou em qualquer plataforma que sirva Next.js.

## Fluxo

Issue → branch `tipo/<número>` a partir da `develop` → PR para `develop` →
merge na `main` gera a release (semantic-release) e a imagem
`ghcr.io/elvisea/elvisea.dev`. Detalhes para agentes de código em
[`AGENTS.md`](AGENTS.md).
