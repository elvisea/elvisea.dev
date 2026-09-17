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
      className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-pre:rounded-xl [&_:is(h1,h2,h3,h4)_a:hover]:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
