import { describe, expect, it } from "bun:test";

import { site } from "@/content/pt-BR/site";

import { getNotFoundViewModel } from "./get-not-found-view-model";

describe("getNotFoundViewModel", () => {
  it("traz código, textos e o caminho de volta", () => {
    expect(getNotFoundViewModel()).toEqual({
      code: "404",
      title: site.notFound.title,
      description: site.notFound.description,
      back: { href: "/", label: site.notFound.backHome },
    });
  });
});
