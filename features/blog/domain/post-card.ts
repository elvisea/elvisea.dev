/** Modelo do card de post, usado em `/blog` e na prévia da home. */
import type { PostSummary } from "@/features/blog/repository/schema";
import { postPath } from "@/features/blog/routes";

import {
  type PostMetaModel,
  type PostMetaTexts,
  toPostMetaModel,
} from "./post-meta";

/** Tags acima disto viram poluição visual no card. */
const MAX_TAGS = 3;

export interface PostCardTexts {
  readMore: string;
  meta: PostMetaTexts;
}

export interface PostCardModel {
  slug: string;
  href: string;
  title: string;
  description: string;
  tags: readonly string[];
  meta: PostMetaModel;
  readMore: { label: string; ariaLabel: string };
}

export function toPostCardModel(
  post: PostSummary,
  texts: PostCardTexts,
): PostCardModel {
  const { title, description, tags } = post.frontmatter;
  return {
    slug: post.slug,
    href: postPath(post.slug),
    title,
    description,
    tags: tags.slice(0, MAX_TAGS),
    meta: toPostMetaModel(post, texts.meta),
    readMore: {
      label: texts.readMore,
      ariaLabel: `${texts.readMore}: ${title}`,
    },
  };
}
