import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import type { CertificateModel } from "@/features/about/domain/credentials";

import { CertificateList } from "./certificate-list";

const comLink: CertificateModel = {
  slug: "com-link",
  title: "Curso com credencial",
  issuer: "Escola",
  date: { label: "jun/2025", iso: "2025-06" },
  url: "https://exemplo.dev/cert",
};

const semLink: CertificateModel = {
  slug: "sem-link",
  title: "Curso sem credencial",
  issuer: "Outra escola",
  date: { label: "sem data" },
};

describe("CertificateList", () => {
  it("com link, o card inteiro abre a credencial em nova aba", () => {
    render(<CertificateList items={[comLink]} viewLabel="Ver certificado" />);
    const link = screen.getByRole("link", {
      name: /Ver certificado: Escola Curso com credencial/,
    });
    expect(link).toHaveAttribute("href", "https://exemplo.dev/cert");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("jun/2025")).toHaveAttribute("datetime", "2025-06");
  });

  it("sem link, o card não vira link e a data fica sem <time>", () => {
    render(<CertificateList items={[semLink]} viewLabel="Ver certificado" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Curso sem credencial")).toBeInTheDocument();
    expect(screen.getByText("sem data").tagName).not.toBe("TIME");
  });
});
