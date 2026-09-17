# Review de código (elvisea.dev)

Revisão **antes de commit**, **antes de PR** ou quando solicitado. Alinhar com
[`AGENTS.md`](../../AGENTS.md) (regras de conteúdo, stack, paleta,
design atômico).

## Rastreabilidade (quando usar issues/PR)

- Preferir ramos `tipo/numero-descricao` e PR com impacto revisável na `develop`.
- `Closes #N` na descrição quando fechar issue automaticamente fizer parte do fluxo da equipe.

## Quando usar

- Fluxo paralelo aos comandos de commit ou PR (“rodar revisão rápida”).
- Antes do merge quando alguém pedir segunda opinião.

## Workflow de saída

1. **`git diff` + `git diff --cached`** (ou diff contra branch base combinada).
2. Listar categorias tocadas (`app`, `components`, Docker, `.github`).
3. Aplicar checklist abaixo (itens marcados onde **não** aplicáveis são “NA”).
4. Reportar findings com arquivo e linha; severidade uniforme ao agent
   **`code-reviewer`**.

### Severidades

| Nível        | Critério breve                                                |
| ------------ | ------------------------------------------------------------- |
| **Crítico**  | segurança, bug provável, quebra CI/contratos, dados sensíveis |
| **Aviso**    | inconsistência forte, regressão técnica de manutenibilidade   |
| **Sugestão** | polimento opcional                                            |

---

## Checklist

### TypeScript

- Sem `any` solto sem justificativa; preferir tipo explícito ou `unknown` + narrowing.
- Componentes props tipadas (`Readonly<{…}>` em exports quando faz sentido).
- Funções assíncronas com retorno (`Promise<T>`) explícito nas fronteiras públicas quando útil ao time.

### Next.js 16 — App Router

- `"use client"` só onde há hooks de cliente / estado browser.
- Server Components não puxando módulos **só cliente** inadvertidamente.
- `params` / `searchParams` modelados conforme modelo do projeto (**Promise** onde o Next assim expõe tipos/helpers).
- `next/image` para assets otimizados quando não for SVG inline deliberado / ícone já componente.
- Metadados nas rotas públicas relevantes (`metadata` ou `generateMetadata`).
- Handlers em `app/api/*/route.ts` com status corretos, erros tratados, sem expor stacks em produção.
- Preferir validação estrutural no boundary (ex.: **Zod**) para inputs externos — quando o projeto já adota Zod ou equivalente.

### shadcn (stack `@base-ui/react` neste repo)

- Não usar padrões de Radix obsoletos para este preset: **sem** `asChild` nos
  mesmos lugares esperados pela doc antiga; seguir instalador (`bunx --bun shadcn add …`).
- Tokens CSS e cores de marca (**AGENTS.md**):

  | Token semântico | Diretriz rápida                        |
  | --------------- | -------------------------------------- |
  | Texto e fundo   | contraste AA nos dois temas            |
  | `primary`       | `#0F766E` (claro) / `#2DD4BF` (escuro) |
  | `highlight`     | `#4F46E5` (claro) / `#818CF8` (escuro) |
  | Cores fixas     | proibidas em componentes; usar tokens  |

- Manter **`components/ui/`** dominado pelo output estável da CLI onde possível — evitar “fork” grande sem razão documentada.

### Design atômico (AGENTS.md)

Camadas esperadas átomo → página; checar que:

- organismos grandes não ficam dentro de átomos;
- data-fetch e efeitos de rota ficam nos níveis mais altos (páginas / organismos) sem poluir primitives.

### Mobile-first / Tailwind

- Breakpoints típicos: base mobile → `sm` → `md` → …
- Áreas clicáveis alvo **≥ ~44×44 px** onde houver gestos tocáveis densos em mobile.
- Evitar layouts que cortem fluxo só em viewport pequena sem fallback.

### Testes (`bun test`)

- Novas regras de negócio em `lib/**` devem ter **onde fizer sentido** testes de unidade próximos.
- Não remover teste só para “silenciar” a CI.

### Segurança

- Secrets só via env; **`NEXT_PUBLIC_`** apenas para valores realmente públicos.
- Inputs validados antes de persistência ou redirects confiados.
- `rel="noopener noreferrer"` em `<a target="_blank">`.

### Docker / CI (quando o diff afeta infra)

- `Dockerfile` multi-stage compatível com `output: standalone`.
- Compose com healthcheck / portas esperadas quando alterados.
- Workflows Actions: segurança (audit/Trivy) e jobs de lint/format/build/test coerentes com `package.json`.

### Conteúdo (regras do AGENTS.md)

- **Crítico:** frase de efeito, slogan ou promessa em texto público; telefone,
  salário, licitação ou detalhe interno de empregador; link para a página da Trio.
- **Aviso:** fato sem fonte no `presenca-digital` ou número inventado.
- Texto de interface fica em `content/pt-BR/`, não fixo em componente.
