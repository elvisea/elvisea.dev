import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

// Fronteiras entre camadas (AGENTS.md § Arquitetura). Cada regra liga para
// uma pasta só quando ela já está conforme; a migração de #22, #23 e #24
// amplia os globos até cobrir `components/**`.
const forbid = {
  content: {
    group: ["@/content/*"],
    message: "Textos e dados chegam por props, vindos do view-model.",
  },
  // Só as fachadas que consultam dados e as leituras de arquivo. Utilitários
  // puros de `lib/content` (datas, registro de ícones) seguem liberados.
  dataLib: {
    regex:
      "^@/lib/(blog|projects|content)(/index)?$|^@/lib/blog/source$|^@/lib/content/markdown-page$",
    message: "Consulta de dados fica no repository, chamado pelo view-model.",
  },
  repository: {
    group: ["@/features/*/repository/*"],
    allowTypeImports: true,
    message: "Só o view-model chama o repository.",
  },
  organisms: {
    group: ["**/organisms/*"],
    message: "Átomo e molécula nunca importam organismo.",
  },
  molecules: {
    group: ["**/molecules/*", "**/templates/*"],
    message: "Átomo não importa camada acima dele.",
  },
  app: {
    group: ["@/app/*"],
    message: "Só `app/` importa de `app/`.",
  },
};

// As fronteiras valem para o código de produção: um teste pode importar o
// conteúdo real para comparar com o que a tela mostra.
const layer = (files, patterns) => ({
  files,
  ignores: ["**/*.test.ts", "**/*.test.tsx"],
  rules: { "no-restricted-imports": ["error", { patterns }] },
});

const layerRules = [
  layer(
    ["components/atoms/**", "features/*/components/atoms/**"],
    [
      forbid.content,
      forbid.dataLib,
      forbid.repository,
      forbid.organisms,
      forbid.molecules,
      forbid.app,
    ],
  ),
  layer(
    ["features/*/components/molecules/**"],
    [
      forbid.content,
      forbid.dataLib,
      forbid.repository,
      forbid.organisms,
      forbid.app,
    ],
  ),
  layer(
    ["components/templates/**"],
    [
      forbid.content,
      forbid.dataLib,
      forbid.repository,
      forbid.organisms,
      forbid.app,
    ],
  ),
  layer(
    ["features/*/*/view/**"],
    [forbid.content, forbid.dataLib, forbid.repository, forbid.app],
  ),
  layer(
    ["lib/**"],
    [
      {
        group: ["@/app/*", "@/features/*", "@/components/*"],
        message:
          "`lib/` só tem utilitários transversais: nunca importa app/, features/ nem components/.",
      },
    ],
  ),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react 7.x detecta a versão do React com uma API que o
    // ESLint 10 removeu (context.getFilename). Com a versão explícita, a
    // detecção não roda. Manter igual à major/minor do React no package.json.
    settings: { react: { version: "19.3" } },
  },
  ...layerRules,
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
