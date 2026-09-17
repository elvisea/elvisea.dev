import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { site } from "@/content/pt-BR/site";

import { loadPostsFromDir } from "./source";

let tmp: string;

beforeEach(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "blog-"));
});

afterEach(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

const write = (name: string, content: string) =>
  fs.writeFile(path.join(tmp, name), content, "utf8");

describe("loadPostsFromDir", () => {
  it("retorna [] se diretório não existir", async () => {
    const posts = await loadPostsFromDir(path.join(tmp, "missing"));
    expect(posts).toEqual([]);
  });

  it("ignora arquivos não-.md", async () => {
    await write("ignored.txt", "no md");
    const posts = await loadPostsFromDir(tmp);
    expect(posts).toEqual([]);
  });

  it("ordena por date desc e aplica defaults do schema", async () => {
    await write(
      "antigo.md",
      "---\ntitle: Antigo\ndescription: A\ndate: 2025-01-01\n---\nbody",
    );
    await write(
      "novo.md",
      "---\ntitle: Novo\ndescription: N\ndate: 2026-04-01\n---\nbody",
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts.map((p) => p.slug)).toEqual(["novo", "antigo"]);
    expect(posts[0].frontmatter.author).toBe(site.person.name);
    expect(posts[0].frontmatter.tags).toEqual([]);
    expect(posts[0].frontmatter.draft).toBe(false);
  });

  it("normaliza date YAML (Date) para string ISO YYYY-MM-DD", async () => {
    await write(
      "yaml-date.md",
      "---\ntitle: T\ndescription: D\ndate: 2026-05-03\n---\nx",
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts[0].frontmatter.date).toBe("2026-05-03");
  });

  it("preserva date como string ISO quoted", async () => {
    await write(
      "quoted.md",
      `---\ntitle: T\ndescription: D\ndate: "2026-05-03"\n---\nx`,
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts[0].frontmatter.date).toBe("2026-05-03");
  });

  it("inclui draft: true (filtragem fica na fachada)", async () => {
    await write(
      "draft.md",
      "---\ntitle: D\ndescription: x\ndate: 2026-05-01\ndraft: true\n---\nx",
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts).toHaveLength(1);
    expect(posts[0].frontmatter.draft).toBe(true);
  });

  it("lança erro descritivo em frontmatter inválido", async () => {
    await write(
      "bad.md",
      "---\ndescription: sem title\ndate: 2026-05-01\n---\nx",
    );
    let err: unknown;
    try {
      await loadPostsFromDir(tmp);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toMatch(/Invalid frontmatter in "bad\.md"/);
  });

  it("coverImage ausente → undefined", async () => {
    await write(
      "no-cover.md",
      "---\ntitle: T\ndescription: D\ndate: 2026-05-01\n---\nx",
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts[0].frontmatter.coverImage).toBeUndefined();
  });

  it("preserva tags e coverImage quando informados", async () => {
    await write(
      "rich.md",
      `---\ntitle: T\ndescription: D\ndate: 2026-05-01\ntags: [a, b]\ncoverImage: /blog/x.png\n---\nx`,
    );
    const posts = await loadPostsFromDir(tmp);
    expect(posts[0].frontmatter.tags).toEqual(["a", "b"]);
    expect(posts[0].frontmatter.coverImage).toBe("/blog/x.png");
  });
});
