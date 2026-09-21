import { JsonLd } from "@/components/atoms/json-ld";
import {
  type BreadcrumbItem,
  breadcrumbNode,
  jsonLdGraph,
  type JsonLdNode,
} from "@/lib/seo/structured-data";

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
