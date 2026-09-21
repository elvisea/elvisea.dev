import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import type { EducationModel } from "@/features/about/domain/credentials";

import { EducationList } from "./education-list";

const comPeriodo: EducationModel = {
  institution: "UTFPR",
  degree: "Bacharelado",
  field: "Sistemas de Informação",
  years: "2019 – 2023",
};

const semPeriodo: EducationModel = {
  institution: "Escola Técnica",
  degree: "Técnico",
  field: "Informática",
  years: null,
};

describe("EducationList", () => {
  it("mostra instituição, curso e o período quando existe", () => {
    render(<EducationList items={[comPeriodo]} />);
    expect(screen.getByText("UTFPR")).toBeInTheDocument();
    expect(
      screen.getByText("Bacharelado em Sistemas de Informação"),
    ).toBeInTheDocument();
    expect(screen.getByText("2019 – 2023")).toBeInTheDocument();
  });

  it("sem período, a linha não aparece", () => {
    render(<EducationList items={[semPeriodo]} />);
    expect(screen.getByText("Escola Técnica")).toBeInTheDocument();
    expect(screen.queryByText("–", { exact: false })).toBeNull();
  });

  it("um item por formação", () => {
    render(<EducationList items={[comPeriodo, semPeriodo]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
