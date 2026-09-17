/**
 * Pré-carregado pelo bun:test (`bunfig.toml` -> `[test] preload`).
 *
 * Resolve dois imports server-only que dão erro fora do contexto
 * react-server quando rodamos tests unitários no Bun puro:
 *
 * - `server-only`: pacote do React que lança ao ser importado em client
 *   bundle. Mockado para `{}` (espelha o alias de aerobi-web).
 * - `next/headers`: API que só roda no server runtime do Next; mockada
 *   para retornar um stub simples. Tests específicos podem sobrescrever
 *   via `mock.module("next/headers", ...)` localmente, se precisarem.
 */
import { mock } from "bun:test";

mock.module("server-only", () => ({}));

mock.module("next/headers", () => ({
  headers: async () => ({
    get: () => null,
  }),
}));
