import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getServicesCatalogViewModel } from "@/features/services/catalog/view-model/get-services-catalog-view-model";

import { ServicesCatalogView } from "./services-catalog-view";

describe("ServicesCatalogView", () => {
  const model = getServicesCatalogViewModel();

  it("tem um h1 e um card por serviço, com título h2", () => {
    render(<ServicesCatalogView model={model} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const service of model.services) {
      expect(screen.getByRole("link", { name: service.title })).toHaveAttribute(
        "href",
        service.href,
      );
    }
  });

  it("termina com a chamada para o contato", () => {
    render(<ServicesCatalogView model={model} />);
    expect(
      screen.getByRole("link", { name: model.contact.cta }),
    ).toHaveAttribute("href", model.contact.href);
  });
});
