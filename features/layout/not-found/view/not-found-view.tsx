import Link from "next/link";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { buttonVariants } from "@/components/ui/button";
import type { NotFoundViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";
import { cn } from "cn";

/** Página 404. */
export function NotFoundView({ model }: { model: NotFoundViewModel }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-4 py-24 sm:px-6">
      <Eyebrow>{model.code}</Eyebrow>
      <h1 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">
        {model.title}
      </h1>
      <p className="text-lg text-muted-foreground">{model.description}</p>
      <Link
        className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
        href={model.back.href}
      >
        {model.back.label}
      </Link>
    </section>
  );
}
