import { describe, expect, it, mock } from "bun:test";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getContactViewModel } from "@/features/contact/form/view-model/get-contact-view-model";
import type {
  ContactAction,
  ContactActionState,
} from "@/features/contact/repository/types";

import { ContactForm } from "./contact-form";

const { form: texts } = getContactViewModel();

async function send() {
  await userEvent.click(screen.getByRole("button", { name: texts.submit }));
}

describe("ContactForm", () => {
  it("mostra os campos com rótulo e o botão de envio", () => {
    render(<ContactForm action={mock<ContactAction>()} texts={texts} />);
    for (const label of [
      texts.fields.name.label,
      texts.fields.email.label,
      texts.fields.company.label,
      texts.fields.message.label,
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByText(texts.fields.company.hint)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: texts.submit })).toBeEnabled();
  });

  it("envia o que foi digitado, a isca e a marca de início", async () => {
    const action = mock<ContactAction>(async () => ({ ok: true }));
    render(<ContactForm action={action} texts={texts} />);
    await userEvent.type(screen.getByLabelText(texts.fields.name.label), "Ana");
    await send();
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const formData = action.mock.calls[0]![1];
    expect(formData.get("name")).toBe("Ana");
    expect(formData.get("website")).toBe("");
    expect(Number(formData.get("startedAt"))).toBeGreaterThan(0);
  });

  it("erro: alerta, erro no campo e valores digitados preservados", async () => {
    const failure: ContactActionState = {
      ok: false,
      error: "Revise os campos destacados.",
      fieldErrors: { email: ["Informe um e-mail válido."] },
      values: {
        name: "Ana",
        email: "ana@",
        company: "ACME",
        reason: "vaga",
        message: "curta",
        service: "",
      },
    };
    render(<ContactForm action={async () => failure} texts={texts} />);
    await send();
    expect(
      await screen.findByText("Revise os campos destacados."),
    ).toBeInTheDocument();
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
    expect(screen.getByLabelText(texts.fields.email.label)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText(texts.fields.name.label)).toHaveValue("Ana");
    expect(screen.getByLabelText(texts.fields.message.label)).toHaveValue(
      "curta",
    );
  });

  it("sucesso: troca o formulário pela confirmação", async () => {
    render(<ContactForm action={async () => ({ ok: true })} texts={texts} />);
    await send();
    expect(await screen.findByRole("status")).toHaveTextContent(
      texts.success.title,
    );
    expect(
      screen.getByRole("button", { name: texts.success.again }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(texts.fields.name.label)).toBeNull();
  });

  it("vindo de um serviço: assunto pré-selecionado e serviço no campo oculto", () => {
    const { container } = render(
      <ContactForm
        action={mock<ContactAction>()}
        prefill={{
          reason: "projeto",
          service: { slug: "pagamentos-pix", title: "Pagamentos com PIX" },
        }}
        texts={texts}
      />,
    );
    expect(
      screen.getByText(`${texts.fields.service.label}: Pagamentos com PIX`),
    ).toBeInTheDocument();
    expect(container.querySelector('input[name="service"]')).toHaveValue(
      "pagamentos-pix",
    );
    expect(container.querySelector('input[name="reason"]')).toHaveValue(
      "projeto",
    );
  });
});
