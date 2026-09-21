import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import type { EducationModel } from "@/features/about/domain/credentials";

/** Formação acadêmica, um item por instituição. */
export function EducationList({ items }: { items: readonly EducationModel[] }) {
  return (
    <ItemGroup className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Item
          key={item.institution}
          className="bg-card p-5"
          role="listitem"
          variant="outline"
        >
          <ItemContent>
            <ItemTitle className="text-base text-heading">
              {item.institution}
            </ItemTitle>
            <ItemDescription className="text-foreground">
              {item.degree} em {item.field}
            </ItemDescription>
            {item.years ? (
              <ItemDescription className="font-mono text-xs">
                {item.years}
              </ItemDescription>
            ) : null}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
