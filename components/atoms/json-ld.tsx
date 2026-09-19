/**
 * Renderização dos dados estruturados. Os nós vêm de
 * `lib/seo/structured-data.ts`.
 *
 * Escapa `<` para impedir que texto do conteúdo feche a tag `<script>`
 * (recomendação do Next para JSON-LD).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
