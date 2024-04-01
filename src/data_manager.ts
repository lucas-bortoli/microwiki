interface WikiData {
  version: 1;
  title: string;
  articles: {
    id: string;
    title: string;
    content: string;
    assets: {
      id: string;
      name: string;
      mimeType: string;
      content: Uint8Array;
    }[];
  }[];
}

const defaultWikiData: WikiData = {
  version: 1,
  title: "My New Wiki",
  articles: [
    {
      id: crypto.randomUUID(),
      title: "Getting started",
      content: `# Hello World!`,
      assets: [],
    },
  ],
};

export function getInitial() {
  const storedData = document.querySelector("#data-store")?.textContent;

  if (typeof storedData === "string") {
    return JSON.parse(storedData) as WikiData;
  }

  return structuredClone(defaultWikiData);
}

export function save(wikiData: WikiData) {
  const fileContents: string[] = [];

  const $ = document.querySelector.bind(document);
  const $$ = (s: string) => [...document.querySelectorAll(s)];

  // Copy over our tags
  fileContents.push(
    "<!DOCTYPE html>",
    $("head > title")!.outerHTML,
    ...$$("head > meta").map((meta) => meta.outerHTML),
    ...$$("head > link").map((link) => link.outerHTML),
    ...$$("head > style").map((style) => style.outerHTML),
    ...$$("head > script[type='module']").map((script) => script.outerHTML),
    '<script type="application/json" id="data-store">',
    JSON.stringify(wikiData),
    "</script>",
    '<div id="app"></div>'
  );

  const data = new Blob(fileContents, {
    type: "text/html",
  });

  console.info("Generated data:", data.size, "bytes");
  console.debug(fileContents);

  const objUrl = URL.createObjectURL(data);
  const $dlEl = document.createElement("a");
  $dlEl.download = "wiki.html";
  $dlEl.href = objUrl;
  $dlEl.click();
  setTimeout(() => URL.revokeObjectURL(objUrl), 60000);
}
