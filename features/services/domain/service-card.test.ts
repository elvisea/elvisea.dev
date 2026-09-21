import { describe, expect, it } from "bun:test";

import type { Service } from "@/features/services/repository/types";
import type { StackItem } from "@/lib/content/types";

import { toServiceCardModel } from "./service-card";

const service = {
  slug: "chatbot-ia-whatsapp",
  title: "Chatbot com IA no WhatsApp",
  shortTitle: "Chatbot com IA",
  summary: "Atendimento automático com IA.",
  stack: ["typescript", "cobol"],
} as unknown as Service;

const stackItem = (key: string): StackItem | undefined =>
  key === "typescript"
    ? { key, label: "TypeScript", icon: "siTypescript" }
    : undefined;

describe("toServiceCardModel", () => {
  it("usa o título curto e o link da página do serviço", () => {
    const model = toServiceCardModel(service, stackItem);
    expect(model).toMatchObject({
      slug: "chatbot-ia-whatsapp",
      href: "/servicos/chatbot-ia-whatsapp",
      title: "Chatbot com IA",
      summary: "Atendimento automático com IA.",
    });
  });

  it("resolve as badges da stack, mantendo a chave desconhecida", () => {
    expect(toServiceCardModel(service, stackItem).stack).toEqual([
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
      { key: "cobol", label: "cobol", icon: undefined },
    ]);
  });
});
