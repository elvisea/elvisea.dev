import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getWhatsAppButtonViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

import { WhatsAppButton } from "./whatsapp-button";

describe("WhatsAppButton", () => {
  it("abre o WhatsApp oficial em nova aba, com nome acessível", () => {
    render(<WhatsAppButton model={getWhatsAppButtonViewModel()} />);
    const link = screen.getByRole("link", { name: "Conversar no WhatsApp" });
    expect(link.getAttribute("href")).toStartWith(
      "https://wa.me/5541992190528?text=",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
