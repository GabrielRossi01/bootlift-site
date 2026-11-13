#!/usr/bin/env node
// Copies Bootlift's rule engine (pure TypeScript, no Node APIs) into this site so
// the playground runs exactly the code the GitHub Action runs. Never edit the
// generated files by hand: change the tag below and run `npm run sync-engine`.
//
// Also generates src/content/examples.generated.ts from the action's own test
// fixtures, with their expected findings, so the playground examples and the
// tests share the action's ground truth.

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "https://github.com/GabrielRossi01/bootlift";
const TAG = "v1.0.1";
const HEADER = `// Gerado por scripts/sync-engine.mjs a partir de bootlift@${TAG}. Não edite.\n`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const engineDir = join(root, "src", "lib", "engine");
const examplesFile = join(root, "src", "content", "examples.generated.ts");

// Node-only or GitHub-only modules stay out of the browser bundle.
const ENGINE_FILES = ["analyze.ts", "project.ts", "types.ts"];

// Playground examples: [id, fixture project, path inside the fixture].
const EXAMPLES = [
  ["pom", "maven-boot3", "pom.xml"],
  ["gradle", "gradle-kts-boot3", "build.gradle.kts"],
  ["yaml", "gradle-kts-boot3", "src/main/resources/application.yml"],
  ["mockbean", "maven-boot3", "src/test/java/dev/rossi/orders/order/OrderControllerTest.java"],
];

/** `from './project.js'` → `from './project'` (relative imports only). */
function stripJsExtension(source) {
  return source.replace(/(from\s+['"])(\.{1,2}\/[^'"]+)\.js(['"])/g, "$1$2$3");
}

const tmp = mkdtempSync(join(tmpdir(), "bootlift-"));
try {
  console.log(`Cloning ${REPO}@${TAG}…`);
  execFileSync("git", ["-c", "advice.detachedHead=false", "clone", "--quiet", "--depth", "1", "--branch", TAG, REPO, tmp], {
    stdio: ["ignore", "inherit", "inherit"],
  });

  rmSync(engineDir, { recursive: true, force: true });
  mkdirSync(join(engineDir, "rules"), { recursive: true });

  const copied = [];
  const copy = (from, to) => {
    const source = readFileSync(join(tmp, "src", from), "utf8");
    writeFileSync(join(engineDir, to), HEADER + stripJsExtension(source));
    copied.push(to);
  };

  for (const file of ENGINE_FILES) copy(file, file);
  for (const file of readdirSync(join(tmp, "src", "rules"))) {
    if (file.endsWith(".ts")) copy(join("rules", file), join("rules", file));
  }

  const examples = EXAMPLES.map(([id, project, path]) => {
    const fixture = join(tmp, "__fixtures__", "projects", project);
    const expected = JSON.parse(readFileSync(join(fixture, "expected.json"), "utf8"));
    const name = path.split("/").pop();
    return {
      id,
      name,
      path,
      content: readFileSync(join(fixture, path), "utf8").replace(/\r\n/g, "\n"),
      expected: expected.expected
        .filter((e) => e.file === path)
        .map(({ ruleId, line }) => ({ ruleId, line })),
      traps: (expected.traps ?? [])
        .filter((e) => e.file === path)
        .map(({ line, match }) => ({ line, match })),
    };
  });

  writeFileSync(
    examplesFile,
    `${HEADER}// Fonte: __fixtures__/projects do repositório do Bootlift (MIT).\n\n` +
      `export type Example = {\n  id: string;\n  name: string;\n  path: string;\n  content: string;\n` +
      `  expected: { ruleId: string; line: number }[];\n  traps: { line: number; match: string }[];\n};\n\n` +
      `export const EXAMPLES: Example[] = ${JSON.stringify(examples, null, 2)};\n`,
  );

  console.log(`Engine: ${copied.length} files → src/lib/engine/`);
  console.log(`Examples: ${examples.map((e) => e.name).join(", ")} → src/content/examples.generated.ts`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
