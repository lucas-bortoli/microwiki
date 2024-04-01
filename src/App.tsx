import { useEffect, useState } from "preact/hooks";
import Article from "./components/Article/index.js";
import { useAppContext } from "./data/Context.js";

export default function App() {
  const context = useAppContext();

  const [isSaving, setIsSaving] = useState(false);

  async function saveChanges() {
    setIsSaving(true);
    await context.serializeDataToFile();
    setIsSaving(false);
  }

  // Previnir usuário de sair da página caso haja uma alteração pendente
  useEffect(() => {
    function onBeforeUnload(event: Event) {
      if (context.hasUnsavedChanges || isSaving) {
        event.preventDefault();
      }
    }

    addEventListener("beforeunload", onBeforeUnload);
    return () => {
      removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [context.hasUnsavedChanges, isSaving]);

  return (
    <div class="h-screen w-screen">
      <aside class="float-right w-4/12 px-4 py-12">
        <h1 class="text-4xl">{context.wikiTitle}</h1>
        <div class="flex flex-wrap gap-1">
          <button
            class="border border-zinc-400 bg-zinc-100 px-2 hover:bg-zinc-50 active:translate-x-px active:translate-y-px active:bg-zinc-200"
            onClick={() => context.createNewArticle()}>
            Add article
          </button>
          {context.hasUnsavedChanges ? (
            <button
              class="animate-pulse border border-red-400 bg-red-100 px-2 font-bold hover:bg-red-50 active:translate-x-px active:translate-y-px active:bg-red-200"
              onClick={saveChanges}
              disabled={isSaving}>
              Save Changes
            </button>
          ) : null}
        </div>
      </aside>
      <main class="h-full w-8/12 max-w-screen-lg overflow-y-auto p-8">
        {context.articles.map((article) => (
          <Article key={article.id} title={article.title} content={article.content} />
        ))}
      </main>
    </div>
  );
}
