import { describe, expect, it } from "bun:test";

import { render } from "@testing-library/react";

import { PageJsonLd } from "./page-json-ld";

function graphOf(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? "{}") as {
    "@graph": { "@type": string; name?: string }[];
  };
}

describe("PageJsonLd", () => {
  it("acrescenta a trilha de navegação aos nós da página", () => {
    const { container } = render(
      <PageJsonLd
        breadcrumb={[{ name: "Serviços", path: "/servicos" }]}
        nodes={[{ "@type": "Service", name: "Chatbot" }]}
      />,
    );
    const types = graphOf(container)["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["Service", "BreadcrumbList"]);
  });

  it("escapa `<` para o texto não fechar a tag script", () => {
    const { container } = render(
      <PageJsonLd breadcrumb={[{ name: "</script><b>", path: "/x" }]} />,
    );
    const script = container.querySelector("script");
    expect(script?.innerHTML).not.toContain("</script>");
    expect(script?.innerHTML).toContain("\\u003c/script>");
  });
});
