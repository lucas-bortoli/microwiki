/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  jsxBracketSameLine: true,
  bracketSameLine: true,
  arrowParens: "always",
  proseWrap: "always",
  plugins: ["prettier-plugin-tailwindcss"],
};
