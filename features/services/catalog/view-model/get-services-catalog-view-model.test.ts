import { describe, expect, it } from "bun:test";

import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { createServicesRepository } from "@/features/services/repository/services-repository";
import type { Service } from "@/features/services/repository/types";

import { getServicesCatalogViewModel } from "./get-services-catalog-view-model";

const repository = createServicesRepository([
  {
    slug: "chatbot",
    shortTitle: "Chatbot",
    title: "Chatbot com IA",
    summary: "Resumo do chatbot.",
    stack: ["typescript"],
  },
] as unknown as readonly Service[]);

describe("getServicesCatalogViewModel", () => {
  it("monta os cards com título curto e link da página", () => {
    const model = getServicesCatalogViewModel(repository);
    expect(model.services).toEqual([
      {
        slug: "chatbot",
        href: "/servicos/chatbot",
        title: "Chatbot",
        summary: "Resumo do chatbot.",
        stack: ["typescript"],
      },
    ]);
  });

  it("leva ao contato com assunto de projeto e tem trilha própria", () => {
    const model = getServicesCatalogViewModel(repository);
    expect(model.contact.href).toBe("/contato?assunto=projeto");
    expect(model.breadcrumb).toEqual([
      { name: servicosPage.label, path: "/servicos" },
    ]);
  });
});
