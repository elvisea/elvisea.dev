/**
 * Pré-carregado pelo bun:test depois de `test-setup.ts` (que registra o DOM):
 * matchers do Testing Library no `expect` e limpeza do `render` entre testes.
 * Tipos dos matchers em `test-matchers.d.ts`.
 */
import { afterEach, expect } from "bun:test";

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
