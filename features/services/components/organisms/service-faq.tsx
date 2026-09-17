"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceFaqItem } from "@/features/services/repository/types";

/** Perguntas frequentes de um serviço, uma aberta por vez. */
export function ServiceFaq({ items }: { items: readonly ServiceFaqItem[] }) {
  return (
    <Accordion className="rounded-xl border border-border bg-card px-5">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="min-h-11 items-center py-3 text-base text-heading">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-base text-pretty text-foreground">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
