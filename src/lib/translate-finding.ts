import type { Finding } from "./engine/types";

type Translate = (key: string, values?: Record<string, string>) => string;

/**
 * The engine speaks Portuguese. For other locales, rebuild the message and fix
 * from messages/<locale>.json (`engine.*`), pulling the dynamic parts (versions,
 * property keys, starter names) out of the finding itself. Anything that can't
 * be parsed falls back to the engine's own text rather than guessing.
 */
export function translateFinding(
  finding: Finding,
  locale: string,
  t: Translate,
): { message: string; fix: string } {
  const original = { message: finding.message, fix: finding.fix };
  if (locale === "pt") return original;

  const { message, fix } = finding;
  switch (finding.ruleId) {
    case "BOOT_VERSION": {
      const version = message.match(/^Spring Boot (\S+?):/)?.[1];
      if (!version) return original;
      const key = `BOOT_VERSION_${finding.severity === "info" ? "info" : "warning"}`;
      return {
        message: t(`${key}.message`, { version }),
        fix: t(`${key}.fix`),
      };
    }
    case "JAVA_BASELINE":
    case "GRADLE_VERSION": {
      const version = message.match(/^(?:Java|Gradle) (\S+?):/)?.[1];
      if (!version) return original;
      return {
        message: t(`${finding.ruleId}.message`, { version }),
        fix: t(`${finding.ruleId}.fix`),
      };
    }
    case "MOCKBEAN_REMOVED": {
      const annotation = message.match(/^(@\w+)/)?.[1];
      const imported = fix.match(/^Importe (\S+)/)?.[1];
      const used = fix.match(/^Use (\S+)/)?.[1];
      if (!annotation || !(imported || used)) return original;
      return {
        message: t("MOCKBEAN_REMOVED.message", { annotation }),
        fix: imported
          ? t("MOCKBEAN_REMOVED.fixImport", { target: imported })
          : t("MOCKBEAN_REMOVED.fixUse", { target: used! }),
      };
    }
    case "STARTER_RENAMED": {
      const from = message.match(/^(\S+) foi renomeado/)?.[1];
      const to = fix.match(/^Use (\S+)/)?.[1];
      if (!from || !to) return original;
      return {
        message: t("STARTER_RENAMED.message", { from }),
        fix: t("STARTER_RENAMED.fix", { to }),
      };
    }
    case "PROPERTY_RENAMED": {
      const key = message.match(/^A propriedade (\S+) foi renomeada/)?.[1];
      const to = fix.match(/^Use (\S+)/)?.[1];
      if (!key || !to) return original;
      return {
        message: t("PROPERTY_RENAMED.message", { key }),
        fix: t("PROPERTY_RENAMED.fix", { to }),
      };
    }
    default:
      return {
        message: t(`${finding.ruleId}.message`),
        fix: t(`${finding.ruleId}.fix`),
      };
  }
}
