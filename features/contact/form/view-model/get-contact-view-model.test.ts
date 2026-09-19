import { describe, expect, it } from "bun:test";

import { contatoPage } from "@/content/pt-BR/pages/contato";
import { site } from "@/content/pt-BR/site";
import { createServicesRepository } from "@/features/services/repository/services-repository";
import type { Service } from "@/features/services/repository/types";

import { getContactViewModel } from "./get-contact-view-model";

const services = createServicesRepository([
  { slug: "chatbot", shortTitle: "Chatbot", title: "Chatbot com IA" },
] as unknown as readonly Service[]);

describe("getContactViewModel", () => {
  const model = getContactViewModel(services);

  it("leva ao formulário só slug e título curto dos serviços", () => {
    expect(model.services).toEqual([{ slug: "chatbot", title: "Chatbot" }]);
  });

  it("lista os outros canais a partir dos links do site", () => {
    expect(model.otherChannels.title).toBe(contatoPage.aside.title);
    expect(model.otherChannels.links).toEqual(
      Object.values(site.links).map(({ label, href }) => ({ label, href })),
    );
  });

  it("traz os textos do formulário, a trilha e a metadata", () => {
    expect(model.form.fields).toBe(contatoPage.fields);
    expect(model.form.submit).toBe(contatoPage.submit);
    expect(model.breadcrumb).toEqual([
      { name: contatoPage.metaTitle, path: "/contato" },
    ]);
    expect(model.metadata).toEqual({
      title: contatoPage.metaTitle,
      description: contatoPage.metaDescription,
      path: "/contato",
    });
  });
});
