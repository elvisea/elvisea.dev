import { afterEach, describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getContactViewModel } from "@/features/contact/form/view-model/get-contact-view-model";

import { ContactFormWithPrefill } from "./contact-form-with-prefill";

const { form: texts } = getContactViewModel();
const services = [{ slug: "pagamentos-pix", title: "Pagamentos com PIX" }];

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("ContactFormWithPrefill", () => {
  it("lê assunto e serviço da URL", () => {
    window.history.pushState(
      {},
      "",
      "/contato?assunto=projeto&servico=pagamentos-pix",
    );
    const { container } = render(
      <ContactFormWithPrefill services={services} texts={texts} />,
    );
    expect(
      screen.getByText(`${texts.fields.service.label}: Pagamentos com PIX`),
    ).toBeInTheDocument();
    expect(container.querySelector('input[name="reason"]')).toHaveValue(
      "projeto",
    );
    expect(container.querySelector('input[name="service"]')).toHaveValue(
      "pagamentos-pix",
    );
  });

  it("sem parâmetros, nada vem pré-selecionado", () => {
    window.history.pushState({}, "", "/contato");
    const { container } = render(
      <ContactFormWithPrefill services={services} texts={texts} />,
    );
    expect(container.querySelector('input[name="service"]')).toHaveValue("");
    expect(
      screen.queryByText(`${texts.fields.service.label}:`, { exact: false }),
    ).toBeNull();
  });
});
