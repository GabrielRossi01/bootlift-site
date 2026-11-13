import { describe, expect, it } from "vitest";
import { analyze } from "@/lib/engine/analyze";
import { classify } from "@/lib/classify";
import { EXAMPLES } from "@/content/examples.generated";

/**
 * The playground must give the same answer as the action. The examples come
 * from the action's own fixtures, together with the findings its test suite
 * expects for each file (expected.json), so this is the action's ground truth.
 */
describe("playground examples match the action", () => {
  it("ships the four examples the brief asks for", () => {
    expect(EXAMPLES.map((e) => e.name)).toEqual([
      "pom.xml",
      "build.gradle.kts",
      "application.yml",
      "OrderControllerTest.java",
    ]);
  });

  for (const example of EXAMPLES) {
    describe(example.name, () => {
      const scope = classify(example.path);
      const result = analyze([
        { scope: scope!, path: example.path, content: example.content },
      ]);
      const found = result.findings.map((f) => `${f.ruleId}@${f.line}`);

      it("is classified", () => {
        expect(scope).toBeDefined();
      });

      it("has expectations from the fixture", () => {
        expect(example.expected.length).toBeGreaterThan(0);
      });

      it("reports every expected finding at the expected line", () => {
        for (const e of example.expected) {
          expect(found).toContain(`${e.ruleId}@${e.line}`);
        }
      });

      it("stays quiet on the fixture's traps", () => {
        const lines = new Set(result.findings.map((f) => f.line));
        for (const trap of example.traps) {
          expect(
            lines.has(trap.line),
            `trap on line ${trap.line}: ${trap.match}`,
          ).toBe(false);
        }
      });

      it("scores below 100", () => {
        expect(result.score).toBeLessThan(100);
      });
    });
  }

  it("pom.xml (Boot 3.3) yields BOOT_VERSION and STARTER_RENAMED", () => {
    const pom = EXAMPLES.find((e) => e.id === "pom")!;
    const result = analyze([
      { scope: "build", path: pom.path, content: pom.content },
    ]);
    const ids = result.findings.map((f) => f.ruleId);
    expect(ids).toContain("BOOT_VERSION");
    expect(ids).toContain("STARTER_RENAMED");
    expect(result.project.boot[0]?.value).toBe("3.3.5");
  });

  it("@MockBean test yields one-click suggestions", () => {
    const test = EXAMPLES.find((e) => e.id === "mockbean")!;
    const result = analyze([
      { scope: "java", path: test.path, content: test.content },
    ]);
    const mock = result.findings.filter((f) => f.ruleId === "MOCKBEAN_REMOVED");
    expect(mock.length).toBeGreaterThan(0);
    expect(mock.every((f) => typeof f.suggestion === "string")).toBe(true);
  });

  it("a clean Boot 4 build file scores 100", () => {
    const result = analyze([
      {
        scope: "build",
        path: "build.gradle.kts",
        content:
          'plugins {\n  id("org.springframework.boot") version "4.0.0"\n}\n',
      },
    ]);
    expect(result.findings).toEqual([]);
    expect(result.score).toBe(100);
  });
});
