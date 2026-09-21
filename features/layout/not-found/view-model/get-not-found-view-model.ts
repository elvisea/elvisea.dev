/** View-model da página 404. */
import { site } from "@/content/pt-BR/site";

export interface NotFoundViewModel {
  code: string;
  title: string;
  description: string;
  back: { href: string; label: string };
}

export function getNotFoundViewModel(): NotFoundViewModel {
  return {
    code: "404",
    title: site.notFound.title,
    description: site.notFound.description,
    back: { href: "/", label: site.notFound.backHome },
  };
}
