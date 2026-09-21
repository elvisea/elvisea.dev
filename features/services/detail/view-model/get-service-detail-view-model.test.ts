import { describe, expect, it } from "bun:test";

import { servicosPage } from "@/content/pt-BR/pages/servicos";
import { createAboutRepository } from "@/features/about/repository/about-repository";
import { createServicesRepository } from "@/features/services/repository/services-repository";
import type { Service } from "@/features/services/repository/types";

import {
  getServiceDetailViewModel,
  getServiceSlugs,
} from "./get-service-detail-view-model";

const service: Service = {
  slug: "pix",
  title: "Pagamentos com PIX",
  shortTitle: "PIX",
  metaTitle: "Integração PIX",
  metaDescription: "Descrição.",
  summary: "Resumo.",
  forWho: ["Quem cobra assinatura."],
  deliverables: ["Cobrança por PIX."],
  process: [{ title: "Modelagem", description: "Planos." }],
  evidence: [
    {
      kind: "experiencia",
      title: "Empresa",
      description: "PIX automático.",
      href: "/experiencia#empresa",
    },
    {
      kind: "codigo-aberto",
      title: "Repo",
      description: "Código.",
      href: "https://github.com/elvisea/repo",
    },
    { kind: "projeto-proprio", title: "Sem nome", description: "SaaS." },
  ],
  stack: ["typescript"],
  faq: [{ question: "Específica?", answer: "Sim." }],
};

const about = createAboutRepository({
  profile: {
    resumo: "",
    atuacao: [],
    engenhariaComIa: "",
    projetosProprios: "",
  },
  stack: [
    {
      title: "Linguagens",
      items: [{ key: "typescript", label: "TypeScript", icon: "siTypescript" }],
    },
  ],
  education: [],
  certificates: [],
});

const repository = createServicesRepository([service]);

describe("getServiceDetailViewModel", () => {
  it("devolve null para slug inexistente", () => {
    expect(getServiceDetailViewModel("nao-existe", repository)).toBeNull();
  });

  it("rotula evidências e marca links externos", () => {
    const model = getServiceDetailViewModel("pix", repository);
    expect(model?.evidence.map((e) => [e.kindLabel, e.external])).toEqual([
      [servicosPage.evidenceKinds.experiencia, false],
      [servicosPage.evidenceKinds["codigo-aberto"], true],
      [servicosPage.evidenceKinds["projeto-proprio"], false],
    ]);
  });

  it("junta as perguntas do serviço às comuns, nessa ordem", () => {
    const model = getServiceDetailViewModel("pix", repository);
    expect(model?.faq).toEqual([...service.faq, ...servicosPage.commonFaq]);
  });

  it("leva ao contato com o serviço e monta trilha, JSON-LD e metadata", () => {
    const model = getServiceDetailViewModel("pix", repository);
    expect(model?.contact.href).toBe("/contato?assunto=projeto&servico=pix");
    expect(model?.breadcrumb).toEqual([
      { name: servicosPage.label, path: "/servicos" },
      { name: "PIX", path: "/servicos/pix" },
    ]);
    expect(model?.jsonLd[0]).toMatchObject({
      "@type": "Service",
      name: "Pagamentos com PIX",
    });
    expect(model?.metadata).toEqual({
      title: "Integração PIX",
      description: "Descrição.",
      path: "/servicos/pix",
    });
  });

  it("lista os slugs para generateStaticParams", () => {
    expect(getServiceSlugs(repository)).toEqual(["pix"]);
  });
});

describe("stack do serviço", () => {
  it("chega resolvida, com rótulo e ícone do repository de sobre", () => {
    const model = getServiceDetailViewModel("pix", repository, about);
    expect(model?.stack).toEqual([
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
    ]);
  });

  it("chave sem item conhecido aparece como está", () => {
    const outro = createServicesRepository([
      { ...service, slug: "outro", stack: ["cobol"] },
    ]);
    const model = getServiceDetailViewModel("outro", outro, about);
    expect(model?.stack).toEqual([
      { key: "cobol", label: "cobol", icon: undefined },
    ]);
  });
});
