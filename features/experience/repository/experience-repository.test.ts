import { describe, expect, it } from "bun:test";

import type { Experience } from "@/lib/content/types";

import {
  createExperienceRepository,
  experienceRepository,
} from "./experience-repository";

const experience = (slug: string, highlight?: boolean): Experience =>
  ({ slug, company: slug, role: "Dev", highlight }) as unknown as Experience;

const repository = createExperienceRepository([
  experience("atual", true),
  experience("anterior"),
  experience("antiga", true),
]);

describe("createExperienceRepository", () => {
  it("lista na ordem do conteúdo", () => {
    expect(repository.list().map((e) => e.slug)).toEqual([
      "atual",
      "anterior",
      "antiga",
    ]);
  });

  it("destaques são só os marcados com highlight", () => {
    expect(repository.highlighted().map((e) => e.slug)).toEqual([
      "atual",
      "antiga",
    ]);
  });

  it("busca por slug", () => {
    expect(repository.findBySlug("anterior")?.company).toBe("anterior");
    expect(repository.findBySlug("nao-existe")).toBeUndefined();
  });
});

describe("experienceRepository", () => {
  it("usa o conteúdo real e tem destaques para a home", () => {
    expect(experienceRepository.list().length).toBeGreaterThan(0);
    expect(experienceRepository.highlighted().length).toBeGreaterThan(0);
  });
});
