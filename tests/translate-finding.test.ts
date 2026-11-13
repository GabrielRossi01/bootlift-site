import { describe, expect, it } from "vitest";
import en from "../messages/en.json";
import { analyze } from "@/lib/engine/analyze";
import { RULE_IDS, type Finding } from "@/lib/engine/types";
import { classify } from "@/lib/classify";
import { translateFinding } from "@/lib/translate-finding";
import { EXAMPLES } from "@/content/examples.generated";

/** Minimal next-intl stand-in: dotted key lookup + {placeholder} interpolation. */
function t(key: string, values: Record<string, string> = {}) {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown>)?.[part],
      en.engine,
    );
  if (typeof value !== "string") throw new Error(`missing engine.${key}`);
  return value.replace(
    /\{(\w+)\}/g,
    (_, name: string) => values[name] ?? `{${name}}`,
  );
}

const PORTUGUESE =
  /\b(foi|removid[oa]|renomead[oa]|exige|Troque|Importe|Suba|Resolva|Rode|pacote)\b/;

describe("translateFinding", () => {
  it("has an English entry for every rule", () => {
    const keys = Object.keys(en.engine);
    for (const id of RULE_IDS) {
      expect(
        keys.some((k) => k === id || k.startsWith(`${id}_`)),
        id,
      ).toBe(true);
    }
  });

  it("keeps the engine's own text in Portuguese", () => {
    const finding: Finding = {
      ruleId: "UNDERTOW_REMOVED",
      severity: "error",
      file: "pom.xml",
      line: 1,
      message: "Undertow foi removido",
      fix: "Use o Tomcat",
    };
    expect(translateFinding(finding, "pt", t)).toEqual({
      message: finding.message,
      fix: finding.fix,
    });
  });

  for (const example of EXAMPLES) {
    it(`translates every finding of ${example.name}`, () => {
      const { findings } = analyze([
        {
          scope: classify(example.path)!,
          path: example.path,
          content: example.content,
        },
      ]);
      for (const finding of findings) {
        const { message, fix } = translateFinding(finding, "en", t);
        expect(message, finding.message).not.toMatch(PORTUGUESE);
        expect(fix, finding.fix).not.toMatch(PORTUGUESE);
        expect(message).not.toMatch(/\{\w+\}/);
      }
    });
  }

  it("carries the property keys into the English text", () => {
    const finding: Finding = {
      ruleId: "PROPERTY_RENAMED",
      severity: "warning",
      file: "application.yml",
      line: 3,
      message:
        "A propriedade spring.data.mongodb.uri foi renomeada no Spring Boot 4",
      fix: "Use spring.mongodb.uri",
    };
    expect(translateFinding(finding, "en", t)).toEqual({
      message:
        "The property spring.data.mongodb.uri was renamed in Spring Boot 4",
      fix: "Use spring.mongodb.uri",
    });
  });
});
