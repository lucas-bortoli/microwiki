import { type PropsWithChildren, createContext, useContext, useState } from "preact/compat";
import { defaultWikiData, save } from "./DataManager";
import { base64toBlob, blobToBase64 } from "../utils/blobBase64";

interface Asset {
  id: string;
  name: string;
  blob: Blob;
}

interface Article {
  id: string;
  title: string;
  content: string;
}

interface AppContext {
  wikiTitle: string;
  articles: Article[];
  assets: Asset[];
  hasUnsavedChanges: boolean;
  createNewArticle(): void;
  updateArticle(): void;
  deleteArticle(id: string): void;
  insertAsset(): void;
  removeAsset(id: string): void;
  serializeDataToFile(): Promise<void>;
}

const context = createContext<AppContext | null>(null);
export const useAppContext = () => useContext(context)!;

export function AppProvider(props: PropsWithChildren) {
  const [wikiTitle, setWikiTitle] = useState(defaultWikiData.title);
  const [articles, setArticles] = useState<AppContext["articles"]>(() => {
    return defaultWikiData.articles.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
    }));
  });
  const [assets, setAssets] = useState<Asset[]>(() => {
    return defaultWikiData.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      blob: base64toBlob(asset.contentBase64, asset.mimeType),
    }));
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const value: AppContext = {
    wikiTitle,
    articles,
    assets,
    hasUnsavedChanges,
    createNewArticle() {
      setArticles([
        {
          id: crypto.randomUUID(),
          title: "New article",
          content: "Hello, world!",
        },
        ...articles,
      ]);
      setHasUnsavedChanges(true);
    },
    updateArticle() {
      setHasUnsavedChanges(true);
    },
    deleteArticle() {
      setHasUnsavedChanges(true);
    },
    insertAsset() {},
    removeAsset(id: string) {},
    async serializeDataToFile() {
      save({
        version: 1,
        title: wikiTitle,
        articles: articles.map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
        })),
        assets: await Promise.all(
          assets.map(async (asset) => ({
            id: asset.id,
            name: asset.name,
            mimeType: asset.blob.type,
            size: asset.blob.size,
            contentBase64: await blobToBase64(asset.blob),
          }))
        ),
      });
      setHasUnsavedChanges(false);
    },
  };

  return <context.Provider value={value}>{props.children}</context.Provider>;
}
