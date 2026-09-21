import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { getResumeViewModel } from "@/features/resume/files/view-model/get-resume-view-model";

import { ResumeView } from "./resume-view";

describe("ResumeView", () => {
  it("h1 da página e um card por arquivo", () => {
    const model = getResumeViewModel();
    render(<ResumeView model={model} />);
    expect(
      screen.getByRole("heading", { level: 1, name: model.header.title }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(model.files.length);
  });
});
