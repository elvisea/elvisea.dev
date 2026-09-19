/**
 * Pré-carregado pelo bun:test (`bunfig.toml` -> `[test] preload`), antes de
 * `test-dom.ts`.
 *
 * 1. Resolve dois imports server-only que dão erro fora do contexto
 *    react-server quando rodamos tests unitários no Bun puro:
 *    - `server-only`: pacote do React que lança ao ser importado em client
 *      bundle. Mockado para `{}` (espelha o alias de aerobi-web).
 *    - `next/headers`: API que só roda no server runtime do Next; mockada
 *      para retornar um stub simples. Tests específicos podem sobrescrever
 *      via `mock.module("next/headers", ...)` localmente, se precisarem.
 * 2. Registra o DOM do happy-dom para os testes de render. Precisa rodar
 *    antes de qualquer import do Testing Library (feito em `test-dom.ts`),
 *    senão as consultas de `screen` falham.
 */
import { mock } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";

mock.module("server-only", () => ({}));

mock.module("next/headers", () => ({
  headers: async () => ({
    get: () => null,
  }),
}));

GlobalRegistrator.register();
