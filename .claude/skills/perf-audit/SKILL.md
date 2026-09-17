---
name: perf-audit
description: Audita a performance de uma página do elvisea.dev com chrome-devtools-mcp — performance trace com Core Web Vitals (LCP, CLS, INP/TBT), insights de long tasks e recursos que bloqueiam a renderização, requisições mais pesadas e recomendações para Next.js. Use quando pedirem para "auditar performance", "medir LCP/Core Web Vitals" ou "ver por que a página está lenta".
argument-hint: "<rota> [--mobile]"
---

# Auditoria de performance

## Alvo

- **Sempre medir o build de produção**, porque o dev server não é
  representativo. Subir o standalone como descrito na skill `smoke-test` (porta 3102) e encerrar no fim.
- Sem rota informada: perguntar. Por padrão, medir `/` e a rota alterada.

## Passos

1. `new_page` na URL e `emulate` do cenário:
   - mobile: `viewport` `400x860x2,mobile,touch`, `cpuThrottlingRate` 4,
     `networkConditions` `Fast 4G`;
   - desktop: `1280x900x1`, sem limitação.
2. **Trace:** `performance_start_trace` com reload e, no fim,
   `performance_stop_trace`. Para cada insight relevante (LCP breakdown,
   render-blocking, layout shift, long tasks, third parties),
   `performance_analyze_insight`.
3. **Rede:** `list_network_requests` e ordenar por tamanho e duração, destacando
   fontes, imagens, JS de cliente e CSS.
4. **Bundle de cliente:** componentes com `"use client"` na rota e o que eles
   importam (Grep). Suspeitos comuns: ícones importados em bloco, bibliotecas de
   highlight/markdown no cliente.
5. Opcional: `lighthouse_audit` para cruzar acessibilidade e SEO (a auditoria de
   performance fica no trace).

## Relatório

- **Veredito** do cenário medido, com limite por métrica:
  - LCP: 🟢 abaixo de 2,5 s, 🔴 acima de 4 s;
  - CLS: 🟢 abaixo de 0,1, 🔴 acima de 0,25;
  - INP/TBT: 🟢 abaixo de 200 ms.
- **Principais gargalos** (3 a 5), por impacto, cada um com causa e
  arquivo/recurso.
- **Recomendações** para Next 16:
  - `next/image` com `sizes`;
  - fonte com `display` adequado;
  - menos `"use client"`;
  - `dynamic()` para o que não aparece acima da dobra;
  - CSS não usado.

Valores só do que foi medido; sem estimar ganho não medido.
