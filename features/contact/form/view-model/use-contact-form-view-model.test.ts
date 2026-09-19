import { describe, expect, it, mock } from "bun:test";

import { act, renderHook } from "@testing-library/react";
import { startTransition } from "react";

import type {
  ContactAction,
  ContactActionState,
} from "@/features/contact/repository/types";

import { useContactFormViewModel } from "./use-contact-form-view-model";

function submit(
  formAction: (formData: FormData) => void,
  formData = new FormData(),
) {
  return act(async () => {
    startTransition(() => formAction(formData));
  });
}

describe("useContactFormViewModel", () => {
  it("começa sem erro, sem envio e com a chave inicial", () => {
    const { result } = renderHook(() =>
      useContactFormViewModel({ action: mock<ContactAction>() }),
    );
    expect(result.current.sent).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fieldsKey).toBe("inicial");
    expect(result.current.pending).toBe(false);
  });

  it("repassa o FormData para a action e marca o envio concluído", async () => {
    const action = mock<ContactAction>(async () => ({ ok: true }));
    const { result } = renderHook(() => useContactFormViewModel({ action }));
    const formData = new FormData();
    formData.set("name", "Ana");
    await submit(result.current.formAction, formData);
    expect(action.mock.calls[0]?.[1].get("name")).toBe("Ana");
    expect(result.current.sent).toBe(true);
  });

  it("falha: expõe a mensagem, os erros por campo e os valores digitados", async () => {
    const failure: ContactActionState = {
      ok: false,
      error: "Revise os campos destacados.",
      fieldErrors: { email: ["Informe um e-mail válido."] },
      values: {
        name: "Ana",
        email: "x",
        company: "",
        reason: "vaga",
        message: "curta",
        service: "",
      },
    };
    const { result } = renderHook(() =>
      useContactFormViewModel({ action: async () => failure }),
    );
    await submit(result.current.formAction);
    expect(result.current.sent).toBe(false);
    expect(result.current.error).toBe("Revise os campos destacados.");
    expect(result.current.invalid("email")).toBe(true);
    expect(result.current.invalid("name")).toBe(false);
    expect(result.current.errorsOf("email")).toEqual([
      { message: "Informe um e-mail válido." },
    ]);
    expect(result.current.values?.email).toBe("x");
    expect(result.current.fieldsKey).toBe(JSON.stringify(failure.values));
  });

  it("marca o início do preenchimento com o relógio injetado", () => {
    const input = document.createElement("input");
    const { result } = renderHook(() => {
      const vm = useContactFormViewModel({
        action: mock<ContactAction>(),
        now: () => 1_700_000_000_000,
      });
      vm.startedAtRef.current ??= input;
      return vm;
    });
    expect(result.current.startedAtRef.current?.value).toBe("1700000000000");
  });

  it("recomeçar chama o restart injetado", () => {
    const restart = mock(() => {});
    const { result } = renderHook(() =>
      useContactFormViewModel({ action: mock<ContactAction>(), restart }),
    );
    result.current.restart();
    expect(restart).toHaveBeenCalledTimes(1);
  });
});
