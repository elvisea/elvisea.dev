/**
 * Corpo do post — wrapper `prose` (Tailwind Typography) que injeta o
 * HTML pré-renderizado vindo de `renderMarkdown`.
 *
 * O uso de `dangerouslySetInnerHTML` é seguro aqui porque o pipeline
 * em `lib/blog/markdown.ts` chama `remark-rehype` com
 * `allowDangerousHtml: false` — HTML inline nos `.md` é descartado
 * antes de chegar a este componente.
 *
 * Renderiza `<div>` (não `<article>`) para que a rota o envolva no
 * `<article>` semântico junto com `<PostHeader>` — evita aninhamento.
 *
 * Tokens da marca aplicados via `--tw-prose-*` em `app/globals.css`.
 */
interface PostBodyProps {
  html: string;
}

export function PostBody({ html }: PostBodyProps) {
  return (
    <div
      className={[
        "prose max-w-none prose-slate dark:prose-invert",
        "prose-headings:scroll-mt-24 prose-pre:rounded-xl",
        // Títulos viram âncoras (rehype-autolink-headings): sem cara de link.
        "[&_:is(h1,h2,h3,h4)_a]:text-inherit [&_:is(h1,h2,h3,h4)_a]:no-underline [&_:is(h1,h2,h3,h4)_a:hover]:underline",
        // Código inline como etiqueta, sem as crases do Typography.
        "prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
