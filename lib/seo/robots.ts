/**
 * Regras do `robots.txt` (`app/robots.ts`), sem tocar em dados.
 *
 * O site existe para ser encontrado, então buscadores e assistentes ficam
 * liberados. Só os crawlers de **treinamento de modelo** levam `Disallow`:
 * consomem o conteúdo e não devolvem visita nenhuma.
 *
 * A distinção importa porque várias empresas usam agentes diferentes para cada
 * finalidade — `GPTBot` treina, `OAI-SearchBot` alimenta a busca do ChatGPT e
 * `ChatGPT-User` só abre a página quando alguém pede. Bloquear o primeiro não
 * tira o site das respostas dos outros dois.
 *
 * Esta lista fica no app, e não no painel da Cloudflare, porque a opção de lá
 * (`ai_training: disallow`) assume o controle do `robots.txt` e prepende um
 * bloco que também barra Baiduspider, PetalBot, GoogleOther e SemrushBot —
 * buscadores e ferramentas que nada têm a ver com treinamento.
 */
import type { MetadataRoute } from "next";

/**
 * Crawlers cujo propósito declarado é treinar ou afinar modelos.
 *
 * Fora daqui de propósito: `Googlebot`, `bingbot`, `Baiduspider`, `YandexBot`,
 * `DuckDuckBot` e `Applebot` (busca); `OAI-SearchBot`, `Claude-SearchBot` e
 * `PerplexityBot` (busca com IA); `ChatGPT-User`, `Claude-User` e
 * `Perplexity-User` (abrem a página a pedido de alguém).
 */
export const AI_TRAINING_USER_AGENTS = [
  "Amazonbot",
  "Applebot-Extended",
  "anthropic-ai",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "Claude-Web",
  "cohere-ai",
  "Diffbot",
  "FacebookBot",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
  "omgili",
  "PanguBot",
  "Timpibot",
] as const;

/**
 * `*` libera tudo; o grupo seguinte barra só o treinamento. Um agente que
 * aparece nos dois grupos obedece ao mais específico, que é o segundo.
 */
export function buildRobotsRules(
  trainingUserAgents: readonly string[] = AI_TRAINING_USER_AGENTS,
): MetadataRoute.Robots["rules"] {
  return [
    { userAgent: "*", allow: "/" },
    { userAgent: [...trainingUserAgents], disallow: "/" },
  ];
}
