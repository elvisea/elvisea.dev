import { describe, expect, it } from "bun:test";

import { isValidSlug, slugFromFilename } from "./slug";

describe("isValidSlug", () => {
  it("aceita slugs lowercase com hífens", () => {
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("post-1")).toBe(true);
    expect(isValidSlug("a")).toBe(true);
    expect(isValidSlug("123")).toBe(true);
  });

  it("rejeita maiúsculas, espaços, hífens duplos ou nas pontas", () => {
    expect(isValidSlug("Hello")).toBe(false);
    expect(isValidSlug("hello world")).toBe(false);
    expect(isValidSlug("hello--world")).toBe(false);
    expect(isValidSlug("-hello")).toBe(false);
    expect(isValidSlug("hello-")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("acentuação")).toBe(false);
  });
});

describe("slugFromFilename", () => {
  it("remove extensão .md", () => {
    expect(slugFromFilename("primeiro-post.md")).toBe("primeiro-post");
  });

  it("aceita .MD case-insensitive", () => {
    expect(slugFromFilename("primeiro-post.MD")).toBe("primeiro-post");
  });

  it("lança em filename com espaço", () => {
    expect(() => slugFromFilename("primeiro post.md")).toThrow(
      /Invalid blog post filename/,
    );
  });

  it("lança em filename com maiúscula", () => {
    expect(() => slugFromFilename("Primeiro-Post.md")).toThrow();
  });
});
