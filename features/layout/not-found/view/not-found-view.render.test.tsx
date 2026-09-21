import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getNotFoundViewModel } from "@/features/layout/not-found/view-model/get-not-found-view-model";

import { NotFoundView } from "./not-found-view";

describe("NotFoundView", () => {
  it("mostra o código, o h1 e o caminho de volta", () => {
    const model = getNotFoundViewModel();
    render(<NotFoundView model={model} />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: model.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: model.back.label }),
    ).toHaveAttribute("href", "/");
  });
});
