import { describe, expect, it } from "bun:test";

import { AI_TRAINING_USER_AGENTS, buildRobotsRules } from "./robots";

/** Achata as regras em pares [agente, permissão], para asserção direta. */
function permissoes(rules: ReturnType<typeof buildRobotsRules>) {
  const lista = Array.isArray(rules) ? rules : [rules];
  return lista.flatMap((rule) => {
    const agentes = Array.isArray(rule?.userAgent)
      ? rule.userAgent
      : [rule?.userAgent];
    return agentes.map((agente) => ({
      agente,
      allow: rule?.allow,
      disallow: rule?.disallow,
    }));
  });
}

describe("buildRobotsRules", () => {
  it("libera o catch-all para que o site seja indexado", () => {
    const catchAll = permissoes(buildRobotsRules()).find(
      (r) => r.agente === "*",
    );
    expect(catchAll?.allow).toBe("/");
    expect(catchAll?.disallow).toBeUndefined();
  });

  it("barra todos os crawlers de treinamento", () => {
    const barrados = permissoes(buildRobotsRules())
      .filter((r) => r.disallow === "/")
      .map((r) => r.agente);
    expect(barrados).toEqual([...AI_TRAINING_USER_AGENTS]);
  });

  it("mantém liberados buscadores e assistentes que trazem visita", () => {
    // Bloquear qualquer um destes tiraria o site de onde o público o procura.
    const devemPassar = [
      "Googlebot",
      "bingbot",
      "Baiduspider",
      "YandexBot",
      "DuckDuckBot",
      "Applebot",
      "OAI-SearchBot",
      "Claude-SearchBot",
      "PerplexityBot",
      "ChatGPT-User",
      "Claude-User",
      "Perplexity-User",
      "GoogleOther",
      "SemrushBot",
      "PetalBot",
    ];
    const barrados = new Set(
      permissoes(buildRobotsRules())
        .filter((r) => r.disallow === "/")
        .map((r) => r.agente),
    );
    for (const agente of devemPassar) {
      expect(barrados.has(agente)).toBe(false);
    }
  });

  it("não confunde o agente de treinamento com o de busca da mesma empresa", () => {
    const barrados = new Set<unknown>(
      permissoes(buildRobotsRules())
        .filter((r) => r.disallow === "/")
        .map((r) => r.agente),
    );
    // GPTBot treina; OAI-SearchBot alimenta a busca do ChatGPT.
    expect(barrados.has("GPTBot")).toBe(true);
    expect(barrados.has("OAI-SearchBot")).toBe(false);
    // ClaudeBot treina; Claude-User abre a página a pedido de alguém.
    expect(barrados.has("ClaudeBot")).toBe(true);
    expect(barrados.has("Claude-User")).toBe(false);
    // Google-Extended treina; Googlebot indexa.
    expect(barrados.has("Google-Extended")).toBe(true);
    expect(barrados.has("Googlebot")).toBe(false);
  });

  it("aceita uma lista injetada, para o teste não depender da constante", () => {
    const barrados = permissoes(buildRobotsRules(["BotDeTeste"]))
      .filter((r) => r.disallow === "/")
      .map((r) => r.agente);
    expect(barrados).toEqual(["BotDeTeste"]);
  });

  it("não repete agente entre os grupos", () => {
    const agentes = permissoes(buildRobotsRules()).map((r) => r.agente);
    expect(new Set(agentes).size).toBe(agentes.length);
  });
});
