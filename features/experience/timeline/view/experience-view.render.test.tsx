import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getExperienceViewModel } from "@/features/experience/timeline/view-model/get-experience-view-model";

import { ExperienceView } from "./experience-view";

describe("ExperienceView", () => {
  const model = getExperienceViewModel();

  it("abre com o h1 e lista uma experiência por item", () => {
    render(<ExperienceView model={model} />);
    expect(
      screen.getByRole("heading", { level: 1, name: model.header.title }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      model.entries.length,
    );
  });
});
