import { highlight } from "@/lib/shiki";

/** Server-rendered syntax highlighting: no client JS. */
export async function CodeBlock({
  code,
  lang = "yaml",
  className = "",
}: {
  code: string;
  lang?: "yaml";
  className?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <div
      className={`code-block font-mono ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
