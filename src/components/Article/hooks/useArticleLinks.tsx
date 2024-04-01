import { type Ref, useEffect } from "preact/hooks";

export default function useArticleLinks($articleBodyRef: Ref<HTMLElement>) {
  useEffect(() => {
    const $bodyElement = $articleBodyRef.current;

    if (!$bodyElement) return;

    console.info("Attaching handlers to rendered article");

    function onElementClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.nodeName === "A") {
        event.preventDefault();
      }
    }

    $bodyElement.addEventListener("click", onElementClick);

    return () => {
      console.info("Cleaning up handlers to rendered article");
      $bodyElement.removeEventListener("click", onElementClick);
    };
  }, [$articleBodyRef]);
}
