import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getProjectsViewModel } from "@/features/projects/catalog/view-model/get-projects-view-model";

import { ProjectsView } from "./projects-view";

describe("ProjectsView", () => {
  const model = getProjectsViewModel();

  it("abre com o h1 e mostra um card por projeto", () => {
    render(<ProjectsView model={model} />);
    expect(
      screen.getByRole("heading", { level: 1, name: model.header.title }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      model.cards.length,
    );
  });
});
