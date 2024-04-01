import { parse } from "marked";
import { useMemo, useRef } from "preact/compat";
import articleStyles from "./Article.module.css";
import useArticleLinks from "./hooks/useArticleLinks";

interface ArticleProps {
  title: string;
  content: string;
}

export default function Article(props: ArticleProps) {
  const $bodyRef = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => {
    return parse(props.content, { async: false, gfm: true, breaks: true }) as string;
  }, [props.content]);

  useArticleLinks($bodyRef);

  return (
    <article class="mb-4 min-h-96 border border-zinc-400 bg-white p-8 shadow-md">
      <h1 class="text-4xl">{props.title}</h1>
      <div
        ref={$bodyRef}
        dangerouslySetInnerHTML={{ __html: markup }}
        class={articleStyles.articleBody}
      />
    </article>
  );
}
