import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react 7.x detecta a versão do React com uma API que o
    // ESLint 10 removeu (context.getFilename). Com a versão explícita, a
    // detecção não roda. Manter igual à major/minor do React no package.json.
    settings: { react: { version: "19.3" } },
  },
  // `.claude/**` inclui `.claude/worktrees/`, cópias do repositório criadas
  // pelos subagentes do Claude Code: sem isso, o lint varre o projeto de novo.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
  ]),
  prettier,
]);

export default eslintConfig;
