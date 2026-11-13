import { createHighlighter, type ThemeRegistration } from "shiki";

/** Code colours from the site tokens, so code reads as part of the page. */
const theme: ThemeRegistration = {
  name: "bootlift",
  type: "dark",
  colors: { "editor.background": "#00000000", "editor.foreground": "#c3ccd7" },
  tokenColors: [
    {
      scope: [
        "entity.name.tag",
        "support.type.property-name",
        "meta.mapping.key",
      ],
      settings: { foreground: "#f0f4f7" },
    },
    {
      scope: ["string", "string.unquoted", "string.unquoted.plain.out.yaml"],
      settings: { foreground: "#b9c4d2" },
    },
    {
      scope: [
        "constant",
        "constant.language",
        "constant.numeric",
        "keyword",
        "storage",
      ],
      settings: { foreground: "#7db5ff" },
    },
    {
      scope: ["punctuation", "punctuation.definition", "punctuation.separator"],
      settings: { foreground: "#8b96a6" },
    },
    {
      scope: ["comment"],
      settings: { foreground: "#8b96a6", fontStyle: "italic" },
    },
  ],
};

let highlighter: ReturnType<typeof createHighlighter> | undefined;

/** Cached: the HTML is computed once at build, so prerendering stays deterministic. */
export async function highlight(code: string, lang: "yaml") {
  "use cache";
  highlighter ??= createHighlighter({ themes: [theme], langs: ["yaml"] });
  return (await highlighter).codeToHtml(code, { lang, theme: "bootlift" });
}
