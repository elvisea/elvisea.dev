import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getContactViewModel } from "@/features/contact/form/view-model/get-contact-view-model";

import { ContactView } from "./contact-view";

describe("ContactView", () => {
  const model = getContactViewModel();

  it("abre com o h1, o formulário e os outros canais", () => {
    render(<ContactView model={model} />);
    expect(
      screen.getByRole("heading", { level: 1, name: model.header.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: model.form.submit }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: model.otherChannels.title,
      }),
    ).toBeInTheDocument();
  });

  it("publica a trilha de navegação", () => {
    const { container } = render(<ContactView model={model} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.textContent).toContain("BreadcrumbList");
  });
});
