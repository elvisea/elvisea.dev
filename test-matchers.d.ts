/**
 * Tipos dos matchers do Testing Library (`toBeInTheDocument`, `toHaveTextContent`…)
 * no `expect` do bun:test. Os matchers são registrados em `test-setup.ts`.
 */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "bun:test" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T> extends TestingLibraryMatchers<
    typeof expect.stringContaining,
    T
  > {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchers extends TestingLibraryMatchers<
    unknown,
    unknown
  > {}
}
