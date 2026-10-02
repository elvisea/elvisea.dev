/**
 * Confere se o build gerado cita algum termo sensível (`FORBIDDEN_TERMS`).
 *
 *   bun run check:forbidden              # padrão: .next/server/app
 *   bun run check:forbidden <pasta>
 *
 * Lê `.html`, `.rsc`, `.xml`, `.txt` e `.json` da pasta. Os achados saem como
 * "termo N de M", nunca como o termo. Sai com 1 se achar algo e com 2 se a
 * lista não estiver definida (`.env.local` ou secret da CI).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  findForbiddenTerms,
  forbiddenTermsFromEnv,
} from "../lib/content/forbidden-terms";

const EXTENSIONS = new Set([".html", ".rsc", ".xml", ".txt", ".json"]);

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

async function main() {
  const dir = process.argv[2] ?? path.join(".next", "server", "app");
  const { terms } = forbiddenTermsFromEnv();
  if (terms.length === 0) {
    console.error(
      "FORBIDDEN_TERMS não definida (.env.local ou secret da CI): nada a conferir.",
    );
    process.exit(2);
  }
  let files = 0;
  let hits = 0;
  for await (const file of walk(dir)) {
    files++;
    const found = findForbiddenTerms(await readFile(file, "utf8"), terms, {
      wholeWord: true,
    });
    if (found.length > 0) {
      hits++;
      console.error(`${file}: ${found.join(", ")}`);
    }
  }
  console.log(
    `${files} arquivos conferidos em ${dir}, ${hits} com termo sensível`,
  );
  process.exit(hits > 0 ? 1 : 0);
}

if (import.meta.main) {
  await main();
}
