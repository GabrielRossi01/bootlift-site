import type { Scope } from "./engine/types";

/** Same set as BUILD_FILES in bootlift's src/scanner.ts (v1.0.1). */
const BUILD_FILES = new Set([
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "gradle.properties",
  "gradle-wrapper.properties",
]);

/**
 * Decides a file's scope from its name, with the same logic as `classify` in
 * bootlift's scanner.ts. Accepts a bare name or a path ("src/main/…/App.java").
 * Returns undefined for files the action would not read.
 */
export function classify(fileName: string): Scope | undefined {
  const name = fileName.trim().split(/[\\/]/).pop() ?? "";
  if (BUILD_FILES.has(name) || name.endsWith(".versions.toml")) return "build";
  if (
    /^(application|bootstrap)([-.][\w.-]*)?\.(properties|ya?ml)$/.test(name)
  ) {
    return "config";
  }
  if (name.endsWith(".java") || name.endsWith(".kt")) return "java";
  return undefined;
}
