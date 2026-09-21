import { ArrowUpRightIcon } from "lucide-react";

import { MonoLabel } from "@/components/atoms/mono-label";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactLink } from "@/features/contact/form/view-model/get-contact-view-model";
import { cn } from "cn";

/** Outros canais de contato (LinkedIn, GitHub), ao lado do formulário. */
export function OtherChannels({
  title,
  links,
}: {
  title: string;
  links: readonly ContactLink[];
}) {
  return (
    <aside className="h-fit">
      <Card className="bg-surface">
        <CardHeader>
          <CardTitle>
            <MonoLabel as="h2">{title}</MonoLabel>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "h-11 px-0 text-base",
                  )}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                  <ArrowUpRightIcon aria-hidden data-icon="inline-end" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
