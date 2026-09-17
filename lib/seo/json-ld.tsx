/**
 * Renderização dos dados estruturados. Os nós vêm de `structured-data.ts`.
 *
 * `JsonLd` escapa `<` para impedir que texto do conteúdo feche a tag
 * `<script>` (recomendação do Next para JSON-LD).
 */
import {
  type BreadcrumbItem,
  breadcrumbNode,
  jsonLdGraph,
  type JsonLdNode,
} from "./structured-data";

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

/** Nós da página mais a trilha de navegação (`BreadcrumbList`). */
export function PageJsonLd({
  breadcrumb,
  nodes = [],
}: {
  breadcrumb: readonly BreadcrumbItem[];
  nodes?: readonly JsonLdNode[];
}) {
  return <JsonLd data={jsonLdGraph([...nodes, breadcrumbNode(breadcrumb)])} />;
}
