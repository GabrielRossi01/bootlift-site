/**
 * Guesses a file name from pasted content, so a Gradle build pasted under
 * "OrderControllerTest.java" can be offered as build.gradle instead of being
 * silently read as Java. Heuristics only: the user keeps the final say.
 */
export function sniffFileName(content: string): string | undefined {
  const text = content.slice(0, 20_000);
  if (!text.trim()) return undefined;

  if (
    /<project[\s>]/.test(text) &&
    /<(artifactId|groupId|modelVersion)>/.test(text)
  ) {
    return "pom.xml";
  }
  if (/^\s*distributionUrl\s*=/m.test(text)) return "gradle-wrapper.properties";
  if (/^\s*\[(versions|libraries|plugins|bundles)\]\s*$/m.test(text)) {
    return "libs.versions.toml";
  }
  if (/^\s*(plugins|dependencies|repositories)\s*\{/m.test(text)) {
    const kotlin =
      /\bid\s*\(\s*"|\b(implementation|testImplementation|api)\s*\(\s*"|\bkotlin\s*\(/.test(
        text,
      );
    return kotlin ? "build.gradle.kts" : "build.gradle";
  }
  if (
    /^\s*(package|import)\s+[\w.*]+\s*;\s*$/m.test(text) ||
    /\bpublic\s+(final\s+)?(class|interface|record|enum)\s+\w+/.test(text)
  ) {
    return "App.java";
  }
  if (
    /^\s*(package|import)\s+[\w.*]+\s*$/m.test(text) &&
    /\b(fun|val|class|object)\s+\w+/.test(text)
  ) {
    return "App.kt";
  }
  if (/^(spring|server|management|logging)\s*:\s*$/m.test(text))
    return "application.yml";
  if (/^(spring|server|management|logging)\.[\w.-]+\s*[=:]/m.test(text)) {
    return "application.properties";
  }
  return undefined;
}
