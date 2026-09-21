import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { ResumeFileCard } from "./resume-file-card";

const file = {
  href: "/curriculo/cv-infra.pdf",
  title: "Currículo de infraestrutura",
  description: "Foco em plataforma e operação.",
  download: "Baixar PDF",
};

describe("ResumeFileCard", () => {
  it("título como h2, descrição e download em nova aba", () => {
    render(<ResumeFileCard file={file} />);
    expect(
      screen.getByRole("heading", { level: 2, name: file.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(file.description)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: file.download });
    expect(link).toHaveAttribute("href", file.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });
});
