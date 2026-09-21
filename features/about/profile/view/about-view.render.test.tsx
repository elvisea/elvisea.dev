import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getAboutViewModel } from "@/features/about/profile/view-model/get-about-view-model";

import { AboutView } from "./about-view";

describe("AboutView", () => {
  const model = getAboutViewModel();

  it("tem um h1 e as seções de stack, formação e certificados", () => {
    render(<AboutView model={model} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const title of [
      model.stack.header.title,
      model.education.header.title,
      model.certificates.header.title,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }
  });

  it("leva ao currículo e a como trabalho", () => {
    render(<AboutView model={model} />);
    expect(
      screen.getByRole("link", { name: model.resumeLink.label }),
    ).toHaveAttribute("href", "/curriculo");
    expect(
      screen.getByRole("link", { name: model.aiEngineering.link.label }),
    ).toHaveAttribute("href", "/como-trabalho");
  });
});
