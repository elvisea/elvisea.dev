import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSiteHeaderViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

import { ThemeToggle } from "./theme-toggle";

const { theme } = getSiteHeaderViewModel();

describe("ThemeToggle", () => {
  it("é um botão com rótulo de alternar tema", () => {
    render(
      <ThemeProvider>
        <ThemeToggle labels={theme} />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toBeOneOf([
      theme.toggleAria,
      theme.toggleLightAria,
      theme.toggleDarkAria,
    ]);
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
