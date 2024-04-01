import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "preact/compat";
import { getStored, save } from "./DataManager";
import { base64toBlob, blobToBase64 } from "../utils/blobBase64";
import uniq from "lodash-es/uniq";

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
  visibleArticles: string[];
  hasUnsavedChanges: boolean;
  openArticle(id: string): void;
  closeArticle(id: string): void;
  createNewArticle(): string;
  updateArticle(): void;
  deleteArticle(id: string): void;
  insertAsset(): void;
  removeAsset(id: string): void;
  serializeDataToFile(): Promise<void>;
}

const context = createContext<AppContext | null>(null);
export const useAppContext = () => useContext(context)!;

const storedWikiData = getStored();

export function AppProvider(props: PropsWithChildren) {
  const [wikiTitle, setWikiTitle] = useState(storedWikiData.title);
  const [articles, setArticles] = useState<AppContext["articles"]>(() => {
    return storedWikiData.articles.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
    }));
  });
  const [assets, setAssets] = useState<Asset[]>(() => {
    return storedWikiData.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      blob: base64toBlob(asset.contentBase64, asset.mimeType),
    }));
  });
  const [visibleArticles, setVisibleArticles] = useState<string[]>(() => {
    const pagesOnUrl = location.hash
      .slice(1)
      .split(",")
      .filter((id) => id.length)
      .filter((id) => !!articles.find((ar) => ar.id === id));

    if (pagesOnUrl.length >= 1) {
      return pagesOnUrl;
    } else {
      return [articles[0]?.id].filter((art) => !!art);
    }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update hash
  useEffect(() => {
    location.hash = visibleArticles.join(",");
  }, [visibleArticles]);

  const value: AppContext = {
    wikiTitle,
    articles,
    assets,
    visibleArticles,
    hasUnsavedChanges,
    openArticle(id) {
      const article = articles.find((ar) => ar.id === id);
      if (!article) {
        throw new Error(`Article ${id} not found.`);
      }
      setVisibleArticles(uniq([...visibleArticles, article.id]));
    },
    closeArticle(id) {
      setVisibleArticles(visibleArticles.filter((artId) => artId !== id));
    },
    createNewArticle() {
      const newArticle = {
        id: crypto.randomUUID(),
        title: "New article",
        content: "Hello, world!",
      };

      setArticles([newArticle, ...articles]);
      setVisibleArticles([newArticle.id, ...visibleArticles]);
      setHasUnsavedChanges(true);

      return newArticle.id;
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
