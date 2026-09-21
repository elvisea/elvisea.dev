import { describe, expect, it } from "bun:test";

import { buildContactEmail } from "./contact-email";

const input = {
  name: "Maria Silva",
  email: "maria@example.com",
  company: undefined,
  reason: "projeto",
  message: "Mensagem com <tags> que precisam de escape.",
};
const receivedAt = new Date("2026-09-17T12:00:00Z");

describe("buildContactEmail", () => {
  it("inclui o serviço de origem no assunto e na tabela", () => {
    const email = buildContactEmail(
      { ...input, service: "pagamentos-pix" },
      receivedAt,
    );
    expect(email.subject).toBe(
      "[elvisea.dev] Projeto ou consultoria (Pagamentos com PIX): Maria Silva",
    );
    expect(email.text).toContain("Serviço: Pagamentos com PIX");
  });

  it("sem serviço, não mostra a linha", () => {
    const email = buildContactEmail(input, receivedAt);
    expect(email.subject).toBe(
      "[elvisea.dev] Projeto ou consultoria: Maria Silva",
    );
    expect(email.text).not.toContain("Serviço:");
  });

  it("escapa HTML da mensagem", () => {
    const email = buildContactEmail(input, receivedAt);
    expect(email.html).toContain("&lt;tags&gt;");
    expect(email.html).not.toContain("<tags>");
  });
});
