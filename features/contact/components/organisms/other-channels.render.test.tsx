import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import { OtherChannels } from "./other-channels";

describe("OtherChannels", () => {
  it("lista os canais como links externos, sob um título h2", () => {
    render(
      <OtherChannels
        links={[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/x/" },
          { label: "GitHub", href: "https://github.com/x" },
        ]}
        title="Outros canais"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Outros canais" }),
    ).toBeInTheDocument();
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/x");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });
});
