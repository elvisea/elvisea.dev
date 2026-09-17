import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/pt-BR/site";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-highlight">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">
        {site.notFound.title}
      </h1>
      <p className="text-lg text-muted-foreground">
        {site.notFound.description}
      </p>
      <Link
        className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
        href="/"
      >
        {site.notFound.backHome}
      </Link>
    </section>
  );
}
