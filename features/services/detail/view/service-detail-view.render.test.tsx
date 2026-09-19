import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import {
  getServiceDetailViewModel,
  getServiceSlugs,
} from "@/features/services/detail/view-model/get-service-detail-view-model";

import { ServiceDetailView } from "./service-detail-view";

const model = getServiceDetailViewModel(getServiceSlugs()[0]);
if (!model) throw new Error("sem serviço no conteúdo");

describe("ServiceDetailView", () => {
  it("abre com o link de volta, o h1 do serviço e o contato", () => {
    render(<ServiceDetailView model={model} />);
    expect(
      screen.getByRole("link", { name: model.labels.back }),
    ).toHaveAttribute("href", model.backHref);
    expect(
      screen.getByRole("heading", { level: 1, name: model.service.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: model.contact.title }),
    ).toHaveAttribute("href", model.contact.href);
  });

  it("mostra as seções do serviço como h2", () => {
    render(<ServiceDetailView model={model} />);
    const { labels } = model;
    for (const title of [
      labels.forWho,
      labels.deliverables,
      labels.process,
      labels.evidence,
      labels.stack,
      labels.faq,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }
  });

  it("publica o JSON-LD com o serviço e a trilha", () => {
    const { container } = render(<ServiceDetailView model={model} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const types = (
      JSON.parse(script?.textContent ?? "{}") as {
        "@graph": { "@type": string }[];
      }
    )["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["Service", "BreadcrumbList"]);
  });
});
