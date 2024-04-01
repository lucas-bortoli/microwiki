import { render } from "preact";
import { getInitial } from "./data_manager";

export default function App() {
  return (
    <>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(getInitial())}</pre>
    </>
  );
}

render(<App />, document.getElementById("app")!);
