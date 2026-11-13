import { Fragment, type ReactNode } from "react";

/**
 * Lets long code tokens wrap only after "/" or ".", never mid-word,
 * so a path breaks as `gradle/wrapper/` + `gradle-wrapper.properties`.
 */
export function breakable(text: string): ReactNode {
  const parts = text.split(/(?<=[/.])/);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <wbr />}
    </Fragment>
  ));
}
