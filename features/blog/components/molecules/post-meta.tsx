import type { PostMetaModel } from "@/features/blog/domain/post-meta";
import { cn } from "cn";

/** Data, atualização, tempo de leitura e autor de um post. */
export function PostMeta({
  meta,
  className,
}: {
  meta: PostMetaModel;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <time dateTime={meta.date.iso}>{meta.date.label}</time>
      {meta.updated ? (
        <>
          <span aria-hidden>·</span>
          <span>
            {meta.updated.prefix}{" "}
            <time dateTime={meta.updated.date.iso}>
              {meta.updated.date.label}
            </time>
          </span>
        </>
      ) : null}
      <span aria-hidden>·</span>
      <span>{meta.readingTime}</span>
      {meta.author ? (
        <>
          <span aria-hidden>·</span>
          <span>
            {meta.author.prefix} {meta.author.name}
          </span>
        </>
      ) : null}
    </p>
  );
}
