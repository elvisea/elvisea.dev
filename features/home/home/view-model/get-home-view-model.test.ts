import { describe, expect, it } from "bun:test";

import { homePage } from "@/content/pt-BR/pages/profissional";
import { site } from "@/content/pt-BR/site";

import { getHomeViewModel } from "./get-home-view-model";

describe("getHomeViewModel", () => {
  it("hero com localização, nome, cargo e os quatro botões na ordem dos públicos", async () => {
    const model = await getHomeViewModel();
    expect(model.hero).toMatchObject({
      location: site.person.location,
      name: site.person.name,
      role: site.person.role,
      stackLabel: homePage.hero.stackLabel,
    });
    expect(model.hero.actions.map((action) => action.href)).toEqual([
      "/curriculo",
      "/servicos",
      site.links.linkedin.href,
      site.links.github.href,
    ]);
    expect(model.hero.actions.filter((action) => action.external)).toHaveLength(
      2,
    );
  });

  it("cada seção leva à página cheia da sua feature", async () => {
    const model = await getHomeViewModel();
    expect(model.profile.more.href).toBe("/sobre");
    expect(model.services.all.href).toBe("/servicos");
    expect(model.experience.more.href).toBe("/experiencia");
    expect(model.projects.more.href).toBe("/projetos");
    expect(model.blog.viewAll.href).toBe("/blog");
    expect(model.contact.cta.href).toBe("/contato");
  });

  it("limita destaques: 6 projetos e 3 posts, com cards já em texto", async () => {
    const model = await getHomeViewModel();
    expect(model.projects.cards.length).toBeLessThanOrEqual(6);
    expect(model.blog.posts.length).toBeLessThanOrEqual(3);
    for (const card of model.projects.cards) {
      expect(card.title).toBeString();
    }
  });

  it("experiência compacta: só os destaques, com link para a página completa", async () => {
    const model = await getHomeViewModel();
    expect(model.experience.entries.length).toBeGreaterThan(0);
    for (const entry of model.experience.entries) {
      expect(entry.roleHref).toStartWith("/experiencia#");
      expect(entry.groups).toEqual([]);
    }
  });

  it("serviços e stack vêm dos repositories, prontos para os componentes", async () => {
    const model = await getHomeViewModel();
    expect(model.services.cards.length).toBeGreaterThan(0);
    expect(model.services.cards[0]?.href).toStartWith("/servicos/");
    expect(model.stack.groups.length).toBeGreaterThan(0);
  });
});
