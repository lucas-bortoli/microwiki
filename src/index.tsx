import { render } from "preact";
import { AppProvider } from "./data/Context.js";
import App from "./App.js";

render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById("app")!
);
