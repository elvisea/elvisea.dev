/**
 * View-models do casco do site: cabeçalho, rodapé e 404. Os textos vêm de
 * `content/pt-BR/site.ts`; o ano do rodapé entra por parâmetro.
 */
import { site } from "@/content/pt-BR/site";

export interface ExternalLink {
  href: string;
  label: string;
}

export interface SiteHeaderViewModel {
  home: { href: string; name: string; domain: string; hint: string };
  navigation: readonly { href: string; label: string }[];
  labels: {
    mainNav: string;
    mobileNav: string;
    openMenu: string;
    role: string;
    name: string;
  };
  theme: typeof site.theme;
  externalLinks: readonly ExternalLink[];
}

export interface SiteFooterViewModel {
  person: { name: string; role: string; location: string };
  navigation: readonly ExternalLink[];
  pages: readonly ExternalLink[];
  externalLinks: readonly ExternalLink[];
  labels: { footerNav: string; domain: string };
  /** Ano e titular separados, como no HTML (dois nós de texto). */
  copyright: { year: string; holder: string };
}

export interface NotFoundViewModel {
  code: string;
  title: string;
  description: string;
  back: { href: string; label: string };
}

const externalLinks = (): ExternalLink[] =>
  Object.values(site.links).map(({ href, label }) => ({ href, label }));

export function getSiteHeaderViewModel(): SiteHeaderViewModel {
  return {
    home: {
      href: "/",
      name: site.person.name,
      domain: site.domain,
      hint: site.a11y.homeLinkHint,
    },
    navigation: site.navigation,
    labels: {
      mainNav: site.a11y.mainNav,
      mobileNav: site.a11y.mobileNav,
      openMenu: site.a11y.openMenu,
      role: site.person.role,
      name: site.person.name,
    },
    theme: site.theme,
    externalLinks: externalLinks(),
  };
}

export function getSiteFooterViewModel(
  now: Date = new Date(),
): SiteFooterViewModel {
  return {
    person: {
      name: site.person.name,
      role: site.person.role,
      location: site.person.location,
    },
    navigation: site.navigation,
    pages: site.footerLinks,
    externalLinks: externalLinks(),
    labels: { footerNav: site.a11y.footerNav, domain: site.domain },
    copyright: {
      year: String(now.getFullYear()),
      holder: site.footer.copyright,
    },
  };
}

export function getNotFoundViewModel(): NotFoundViewModel {
  return {
    code: "404",
    title: site.notFound.title,
    description: site.notFound.description,
    back: { href: "/", label: site.notFound.backHome },
  };
}
